const express = require('express')
const app = express()
const port = 5001
const path = require('path')

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


app.use(express.static(path.join(__dirname, 'build')));


app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});