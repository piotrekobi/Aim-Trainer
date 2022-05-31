from fastapi import FastAPI
from pydantic import BaseModel
import json
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

class Database:

    def __init__(self, db_name=None):
        if db_name == None:
            db_name = "database.json"
        self.db_name = db_name
        
        #jezeli uda nam sie stworzyc, to znaczy ze nie ma jeszcze bazy danych
        try:
            with open(self.db_name, "x") as db:
                self.database = {"Players": []}
        except FileExistsError:
            self.database = self._loadDatabase()

    
    def _loadDatabase(self):
        with open(self.db_name, "r") as db:
            data = json.load(db)
        return data

    # zwraca indeks użytkownika lub -1 jeżeli nie istnieje
    def _getUserIndex(self, nick):
        for i in range(len(self.database["Players"])):
            if self.database["Players"][i]["nick"] == nick:
                return i
        return -1

    #jeżeli chcemy dodać użytkownika najpierw musimy sprawdzic czy taki przypadkiem nie istnieje
    def _addUserIfDoesntExist(self, nick):
        self.database["Players"].append({"nick": nick, "games": []})
        return len(self.database["Players"])-1

    def addUserData(self, nick, mode, timestamp, result):
        #jezeli nie istnieje, tworzymy dla niego "Szkielet"
        nick_idx = self._getUserIndex(nick)
        if nick_idx == -1:
            nick_idx = self._addUserIfDoesntExist(nick)
        self.database["Players"][nick_idx]["games"].append({"timestamp": timestamp, "mode": mode, "result": result})

        data_json = json.dumps(self.database, indent =4)

        with open(self.db_name, "w") as outfile:
            outfile.write(data_json)

        return 1

    def getUserData(self, nick):
        user_idx = self._getUserIndex(nick)
        if user_idx == -1:
            return "User doesn't exist"
        return self.database["Players"][user_idx]




if __name__ == "__main__":
    app = FastAPI()
    app.database = Database()

    app.origins = ["*"]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=app.origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/")
    async def root():
        return {"message": "hello World"}

    @app.get("/user_data/{nick}")
    async def read_user(nick: str):
        return {nick: app.database.getUserData(nick)}

    @app.post("/user_data/")
    async def add_result(nick: str, timestamp: int, mode: int, result: int):
        return app.database.addUserData(nick, mode, timestamp, result)
        
    uvicorn.run(app, host="0.0.0.0", port=8000)

