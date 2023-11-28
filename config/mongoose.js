const mongoose = require('mongoose')

mongoose.Promise = global.Promise

main()

async function main() {
  await mongoose.connect(process.env.MONGO_DB_URL, {dbName: 'votesdb'})
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));
}
