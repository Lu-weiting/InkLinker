module.exports = {
    inputEmpty: (res) => {
        res.status(400).json({ error: 'Client error - Input feild (images?) should not be empty' });
    },
    query: (res) => {
        res.status(500).json({ error: 'Server error - query failed' });
    },
    noToken: (res)=>{
        res.status(401).json({ error: 'Client error - No token provided' });
    },
    wrongToken: (res) => {
        res.status(403).json({ error: 'Client error - Invalid token' });
    },
    emailExist: (res) => {
        res.status(403).json({ error: 'Email already exists' });
    },
    noUser: (res) => {
        res.status(403).json({ error: 'Client error - User Not Found' })
    },
    wrongPassword: (res) => {
        res.status(403).json({ error: 'Sign In Failed - wrong password' });
    },
    notContainAnyProductInOrder: (res) => {
        res.status(403).json({ error: 'Order detail - order req must have a product' });
    },
    variantProblem: (res) => {
        res.status(403).json({ error: 'variant problem - the variant of this product goes wrong' });
    },
    stockProblem: (res) => {
        res.status(403).json({ error: 'stock problem - the stock of this product goes wrong' });
    },
    roleProblem: (res) => {
        res.status(403).json({ error: 'role problem - the role of this product goes wrong(may not exist)' });
    },
    permissionDenied: (res) => {
        res.status(403).json({ error: 'role problem - permission denied' });
    },
    monitorProblem: (res) => {
        res.status(403).json({ error: 'Monitor problem' });
    },

}