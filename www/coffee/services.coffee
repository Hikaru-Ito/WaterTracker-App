angular.module('starter.services', [])

# Database information
.factory 'DB', ($q) ->
  db
  self = this

  errorCB = (err) ->
    console.log "SQL 実行中にエラーが発生しました:#{err.code}"

  initQuery = (tx) ->
    tx.executeSql 'CREATE TABLE IF NOT EXISTS TestTable (
      id integer primary key autoincrement,
      value text,
      created datetime default current_timestamp)'

  successCB = ->

  db = window.openDatabase "Database", "1.0", "TestDatabase", 200000
  db.transaction initQuery, errorCB, successCB

  self.query = (query) ->
    deferred =  do $q.defer
    db.transaction (transaction) ->
      transaction.executeSql query, [], (transaction, result) ->
        deferred.resolve result
      , (transaction, error) ->
        deferred.reject error

    return deferred.promise

  return self

.factory 'Datas', ($http, DB) ->

  values = []

  init = ->
    DB.query 'SELECT * FROM TestTable ORDER BY created DESC'
      .then (result) ->
        values = []
        len = result.rows.length
        i = 0
        while i < len
          value =
            id: result.rows.item(i).id
            value: result.rows.item(i).value
            created: result.rows.item(i).created
          values.push value
          i++

        return values
  do init

  return {
    getDatas: ->
      return DB.query 'SELECT * FROM TestTable ORDER BY created DESC LIMIT 30'
        .then (result) ->
          values = []
          len = result.rows.length
          i = 0
          while i < len
            value =
              id: result.rows.item(i).id
              value: result.rows.item(i).value
              created: result.rows.item(i).created
            values.push value
            i++

          return values
    ,
    addData: (value) ->
      return DB.query('INSERT INTO TestTable (value) VALUES (#{value})')
        .then (result) ->
          return result
  }

