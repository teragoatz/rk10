import xml.etree.ElementTree as ET
from datetime import datetime
from models import Tournament, Player, Round, Match
from repository import PostgresRepository

class TdfIngest:
    def __init__(self, repo: PostgresRepository):
        self.repo = repo

    def parse_bool(self, value):
        return value.lower() == "true"

    def parse_date(self, value):
        try:
            return datetime.strptime(value, "%m/%d/%Y").date()
        except Exception:
            return None

    def parse_datetime(self, value):
        try:
            return datetime.strptime(value, "%m/%d/%Y %H:%M:%S")
        except Exception:
            return None

    def ingest(self, xml_content: str):
        root = ET.fromstring(xml_content)
        # Tournament data
        data = root.find("data")
        tournament_id = data.findtext("id")
        tournament = self.repo.get(Tournament, tournament_id)
        is_finished = root.find("standings") is not None
        if not tournament:
            tournament = Tournament(
                id=tournament_id,
                name=data.findtext("name"),
                city=data.findtext("city"),
                state=data.findtext("state"),
                country=data.findtext("country"),
                roundtime=int(data.findtext("roundtime")),
                finalsroundtime=int(data.findtext("finalsroundtime")),
                organizer_popid=data.find("organizer").attrib.get("popid"),
                organizer_name=data.find("organizer").attrib.get("name"),
                startdate=self.parse_date(data.findtext("startdate")),
                lessswiss=self.parse_bool(data.findtext("lessswiss")),
                autotablenumber=self.parse_bool(data.findtext("autotablenumber")),
                overflowtablestart=int(data.findtext("overflowtablestart")),
                is_finished=is_finished
            )
            self.repo.add(tournament)

        # Players
        for p in root.find("players").findall("player"):
            userid = p.attrib["userid"]
            player = self.repo.get(Player, userid)
            if not player:
                player = Player(
                    userid=userid,
                    firstname=p.findtext("firstname"),
                    lastname=p.findtext("lastname"),
                    birthdate=self.parse_date(p.findtext("birthdate")),
                    starter=self.parse_bool(p.findtext("starter")) if p.findtext("starter") else False,
                    creationdate=self.parse_datetime(p.findtext("creationdate")),
                    lastmodifieddate=self.parse_datetime(p.findtext("lastmodifieddate")),
                )
                self.repo.add(player)
            else:
                self.repo.update(
                    Player, userid,
                    firstname=p.findtext("firstname"),
                    lastname=p.findtext("lastname"),
                    birthdate=self.parse_date(p.findtext("birthdate")),
                    starter=self.parse_bool(p.findtext("starter")) if p.findtext("starter") else False,
                    lastmodifieddate=self.parse_datetime(p.findtext("lastmodifieddate"))
                )

        # Rounds, Pods, Matches
        pods = root.find("pods")
        if pods is not None:
            for pod in pods.findall("pod"):
                for round_elem in pod.find("rounds").findall("round"):
                    round_number = int(round_elem.attrib["number"])
                    round_type = int(round_elem.attrib.get("type", 0))
                    round_stage = int(round_elem.attrib.get("stage", 0))
                    timeleft = int(round_elem.findtext("timeleft", "0"))
                    # Check if round exists for this tournament and number
                    round_obj = next(iter(self.repo.list(Round, tournament_id=tournament_id, number=round_number)), None)
                    if not round_obj:
                        round_obj = Round(
                            tournament_id=tournament_id,
                            number=round_number,
                            type=round_type,
                            stage=round_stage,
                            timeleft=timeleft,
                        )

                        self.repo.add(round_obj)
                        
                        # Refetch
                        round_obj = next(iter(self.repo.list(Round, tournament_id=tournament_id, number=round_number)), None)

                    # Matches
                    matches_elem = round_elem.find("matches")
                    if matches_elem is not None:
                        for match_elem in matches_elem.findall("match"):
                            outcome = int(match_elem.attrib.get("outcome", 0))
                            tablenumber = int(match_elem.findtext("tablenumber", "0"))
                            timestamp = match_elem.findtext("timestamp")
                            timestamp = self.parse_datetime(timestamp) if timestamp else None

                            # Single player match (bye)
                            player1_id = match_elem.find("player")
                            if player1_id is not None:
                                player1_id = player1_id.attrib["userid"]
                                player2_id = None
                            else:
                                player1_id = match_elem.find("player1").attrib["userid"]
                                player2_id = match_elem.find("player2").attrib["userid"]

                            # Check if match exists
                            existing = [
                                m for m in self.repo.list(
                                    Match,
                                    round_id=round_obj.id,
                                    player1_id=player1_id,
                                    player2_id=player2_id,
                                    tablenumber=tablenumber
                                )
                            ]
                            if not existing:
                                match = Match(
                                    round_id=round_obj.id,
                                    player1_id=player1_id,
                                    player2_id=player2_id,
                                    outcome=outcome,
                                    tablenumber=tablenumber,
                                    timestamp=timestamp,
                                )
                                self.repo.add(match)
                            else:
                                match = existing[0]
                                match.outcome = outcome
                                match.timestamp = timestamp
                                self.repo.update(Match, match.id, outcome=outcome, timestamp=timestamp)