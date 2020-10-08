
const express = require('express')
const app = express();

app.use(express.json());

// app.get('/',(req,res) =>{
//     res.send('Hello World!!!');
// });
//
// app.get('/api/courses',(req,res)=>{
//     res.send([1,2,3]);
// });
//
// // /api/courses/1
// app.get('/api/courses/:id',((req, res) =>{
//     res.send(req.params.id);
// }));
//
// app.post('/api/courses',(req,res) =>{
//     const course = {
//         id:courses.length+1,
//         name:req.body.name,
//     };
//     courses.push(course);
//     res.send(course);
// });

app.get('/emaillists',((req, res) =>{
    res.send('It Works!');
    //TODO setup sending back emails
}));

// PORT
const port = process.env.PORT || 3000
app.listen(port,()=> console.log(`Listening on port ${port}!`));