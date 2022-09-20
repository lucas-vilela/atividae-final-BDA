import { MongoClient } from 'mongodb'
import { promises as fs } from 'fs'

const myDB = {
    server: 'localhost',
    port: 27017,
}
const uri = `mongodb://${myDB.server}:${myDB.port}`
const client = new MongoClient(uri);

const dbname = 'loja'
const collectionName  = 'produtos'

try {
    await client.connect()
    if (!client.db('admin').command({ "ping": 1 }))
        throw Error("Erro ao conectar ao banco !!")
    
    console.log("Conectado!")

    const data = await fs.readFile("server/database/loja.json")
    const produtos = JSON.parse(data)

    if (!produtos) throw Error('Arquivo não encontrado!!')

    const mongoDb = client.db(dbname)
    const mongoCollection = mongoDb.collection(collectionName)
    const result = await mongoCollection.insertMany(produtos)

    if (result.insertedCount == 0)
        throw Error('Erro ao importar protudos!')
    
    console.info("Produtos importados com sucesso!")
    console.log({
        "sucess": true,
        "inserted": result.insertedCount,
        "result": result
    })
} catch (error) {
    console.log(error)
}
finally {
    await client.close()
    process.exit(0)
}