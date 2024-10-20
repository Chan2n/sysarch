const express = require('express');
const session = require('express-session');
const app = express();


app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'secret-key', 
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } 
}));


const users = [];


app.set('view engine', 'ejs');


app.get('/', (req, res) => {
    if (req.session.user) {
        return res.redirect('/dashboard');
    }
    res.render('index.ejs', { name: 'Kyle' });
});




app.get('/login', (req, res) => {
    res.render('login.ejs');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        req.session.user = username; 
        return res.redirect('/dashboard');
    }

    res.send('Invalid username or password');
});


app.get('/register', (req, res) => {
    res.render('register.ejs');
});

app.post('/register', (req, res) => {
    const { username, password } = req.body;


    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
        return res.send('User already exists. Please choose a different username.');
    }

   
    users.push({ username, password });
    console.log(users); 

    res.redirect('/login');
});


app.get('/dashboard', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login'); 
    }
    res.render('dashboard.ejs', { username: req.session.user });
});


app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.send('Error logging out');
        }
        res.render('logout.ejs'); 
    });
});


app.get('/users', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    res.render('users.ejs'); 
});

app.get('/products', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login'); 
    }
    res.render('products.ejs'); 
});


app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
