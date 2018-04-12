require("dotenv").config();
const axios = require("axios");
const CryptoCurrency = require("../models/cryptoCurrency");
const Exchange = require("../models/exchange");
const Pair = require("../models/pair");
const Market = require("../models/market");
const Day = require("../models/day");
const fs = require("fs");
const mongoose = require("mongoose");
const parse = require("csv-parse");

mongoose.Promise = require("bluebird");
// mongoose.connect(process.env.mongoUrl);
mongoose.connect("mongodb://localhost:27017/cryptoNalysisApi");


const saveToDb = async () => {
  try {
    await mongoose.connection.on("connected", () => {
      console.log("Connected to Database " + process.env.mongoUrl);
    });
    let saved;
    let exchange = await Exchange.findOne({name:'Binance'});
    console.log(exchange);
    let market = await Market.findOne({exchange_id:exchange._id, symbol:'USDT'});
    console.log(market)
    let pair = await Pair.findOne({market_id:market._id, pair:'BTCUSDT'});
    console.log(pair);
    let day;
    let dataDay;


    let parser = await parse({ delimiter: "," }, async function(err, data) {
      for(let i=0;i<data.length;i++){
        if(i!=0){
          dataDay=data[i];
          day = await Day.findOne({date:data[i][0],pair_id:pair._id});
          if(i==1){
            console.log('inside 1 ')
            day = new Day({
              // 0"Date",1"Price",2"Open",3"High",4"Low",5"Vol.",6"Change %"
              date:dataDay[0],
              openingPrice:dataDay[1],
              lowestPrice:dataDay[4],
              highestPrice:dataDay[3],
              changePercent:dataDay[6],
              totalVolume:dataDay[5],
              pair_id: pair._id
            });
            day = await day.save();
            saved++;
          }
        }
      }
      await mongoose.connection.close(res => {
        console.log("Connection Closed");
      });
    });

    await fs.createReadStream(__dirname + "/my-csv.csv").pipe(parser);


    return saved;
  } catch (error) {
    console.log(error);
  }
};

saveToDb().then((saved)=>{
  console.log(saved);
})


