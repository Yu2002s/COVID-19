import express, {Express, Request, Response, Router} from 'express'
import axios from "axios";

const app: Express = express()
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  next()
})

const router: Router = express.Router()

app.use('/api', router)

router.get('/list', async (req: Request, res: Response) => {
  const {data: result} = await axios.get('https://c.m.163.com/ug/api/wuhan/app/data/list-total?t=339247459769')
  res.json({
    status: 'ok',
    ...result.data
  })
})

app.listen('8888', () => {
  console.log('express listen to http://localhost:8888')
})