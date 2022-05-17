import os
from server import Database

def test_database_init():
    database = Database("database_test.json")
    assert database.database == {"Players": []}
    os.remove("database_test.json")

def test_load_database():
    database = Database("database_test.json")
    nick = "Nick"
    mode = 1
    timestamp = 7777
    result = 672

    database.addUserData(nick, mode, timestamp, result)
    database.addUserData(nick, mode, timestamp, result)
    database.addUserData("nick2", mode, timestamp, result)
    database.addUserData("nick3", mode, timestamp, result)

    database2 = Database("database_test.json")

    assert database.database == database2.database

    os.remove("database_test.json")

def test_get_user_index():
    database = Database("database_test.json")

    assert database._getUserIndex("Asd") == -1

    nick = "Nick"
    mode = 1
    timestamp = 7777
    result = 672

    database.addUserData(nick, mode, timestamp, result)

    database.addUserData(nick, mode, timestamp, result)

    database.addUserData("nick2", mode, timestamp, result)

    database.addUserData("nick3", mode, timestamp, result)

    assert database._getUserIndex("Asd") == -1
    assert database._getUserIndex("Nick") == 0
    assert database._getUserIndex("nick2") == 1
    assert database._getUserIndex("nick3") == 2

    os.remove("database_test.json")


def test_add_user_if_doesnt_exist():
    database = Database("database_test.json")
    nick = "Nick"
    database._addUserIfDoesntExist(nick)

    assert database.getUserData(nick) == {'games': [], 'nick': 'Nick'}

    os.remove("database_test.json")

def test_add_user_data():
    database = Database("database_test.json")
    nick = "Nick"
    mode = 1
    timestamp = 7777
    result = 672

    assert database.getUserData(nick) == "User doesn't exist"
    
    database.addUserData(nick, mode, timestamp, result)

    assert database.getUserData(nick) == {'games': [{'mode': 1, 'result': 672, 'timestamp': 7777}], 'nick': 'Nick'}

    database.addUserData(nick, mode, timestamp, result)

    assert database.getUserData(nick) == {'games': [{'mode': 1, 'result': 672, 'timestamp': 7777}, {'mode': 1, 'result': 672, 'timestamp': 7777}], 'nick': 'Nick'} 
 
    os.remove("database_test.json")
