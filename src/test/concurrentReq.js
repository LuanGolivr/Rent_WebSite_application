//import axios from "axios";
import { loadTest } from "loadtest";
import { createLogger, format,transports } from "winston";
const {combine, timestamp, printf} = format;

let median = 0;

const logger = createLogger({
    level: 'info',
    format: combine(
        timestamp(),
        printf(({ timestamp, level, message}) =>{
            return `${timestamp} ${level}: ${message}`;
        })
    ),
    transports: [
        new transports.File({filename: '../logs/test.log'}),
    ]
});
/*

async function makeRequest(url){
    const id = Math.floor((Math.random() * 100) + 1);
    url += `${id}`;
    const start = Date.now();
    try{
        await axios.get(url);
        const duration = Date.now() - start;

        logger.info(`Request to ${url} took ${duration}ms`);
        median += duration;
    }catch(error){
        logger.error(`Request to ${url} failed: ${error.message}`);
    }
}

async function makeConcurrentRequest(url, count){
    const requests = [];

    for(let i = 0; i < count; i++){
        requests.push(makeRequest(url));
    }

    await Promise.all(requests);
}


function start(){
    const base_url = 'http://localhost:8000/api/post/';
    //const base_url = 'http://localhost:8000/api/post/58';
    const numberOfRequests = 12;

    makeConcurrentRequest(base_url, numberOfRequests).then(()=>{
        logger.info(`Number of concurrent requests: ${numberOfRequests}`);
        logger.info(`The median response time of each request is : ${median / numberOfRequests}`);
        console.log(`Completed ${numberOfRequests} requests`);
    })
}
*/

async function testLantency(){
    const options = {
        url: "http://localhost:8000/api/post/58",
        maxRequests: 10000,
        concurrency: 10000,
    };

    const result = await loadTest(options);
    result.show();
}


await testLantency();