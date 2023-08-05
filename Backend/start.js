
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import multer from 'multer';
const app = express();


const mongoURI = 'mongodb+srv://khushisingh5716:khushi5716@cluster0.vigcan9.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.error('Error connecting to MongoDB:', error));

app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Specify the destination folder
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix); // Specify the filename
  }
});
//const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
// const upload = multer({ dest: 'uploads/' })
app.use(express.static('public'));
const formSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  coverLetter: String,
  resume: String,
});



const Form = mongoose.model('Form', formSchema);


// app.post('/api/submit-form', (req, res) => {
//   const formData = req.body;
//   const newForm = new Form(formData);
//   newForm.save()
//     .then(savedForm => res.json(savedForm))
//     .catch(error => res.status(500).json({ error: 'Failed to save the form data.' }));
// });
app.post('/api/submit-form', upload.single('resume'), (req, res) => {
  console.log(req.file); 
  console.log(req.body);
  const formData = req.body;
  //const resumeFilePath = req.body.resume; // Get the uploaded file path
  // console.log(resumeFilePath);
  // // Add the resumeFilePath to the formData
  // formData.resume = resumeFilePath;

  const newForm = new Form({...formData,resume: req.file?.filename || 'NA'});
  newForm.save()
    .then(savedForm => res.json(savedForm))
    .catch(error => res.status(500).json({ error: 'Failed to save the form data.' }));
});



const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server started on port ${port}`));


