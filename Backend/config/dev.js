module.exports = {
    mongoURI: concat('mongodb+srv://', process.env.DATABASE_USER, ':', process.env.DATABASE_PASS,
     '@cluster0.unxpn.mongodb.net/<dbname>?retryWrites=true&w=majority')
}