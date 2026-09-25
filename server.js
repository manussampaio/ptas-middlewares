import express from 'express';

const app = express()
const PORT = 3000

app.use(express.json());

const tarefas = [
    { id: 1, descricao: 'Fazer compras', concluida: false },
    { id: 2, descricao: 'Estudar para a prova', concluida: false },
    { id: 3, descricao: 'Fazer exercícios', concluida: false },
];

function logger(req, res, next) {
    console.log(`${new Date().toISOString()} - ${req.method} | ${req.url}`);
    next();
}

function validarTarefa(req, res, next) {
    if (!req.body.descricao) {
        return res.status(400).json({ error: 'A descrição da tarefa é obrigatória.' });
    }
    next();
}

function auth(req, res, next) {
    console.log('Autenticando usuário...');
    console.log('Usuário autenticado!');
    next();
}

app.get('/', (req, res) => {
    res.send('API de tarefas no ar!')
});

/* 
    método: GET
    URL: http://localhost:3000/
    resposta: API de tarefas no ar! 200 OK
*/

app.get('/tarefas', (req, res) => {
    const { concluida } = req.query;
    const concluidaBoolean = concluida === 'true'; // preciso mudar pra boolean antes de comparar
    const tarefasConcluidas = tarefas.filter(t => t.concluida === concluidaBoolean);
    if (tarefasConcluidas.length === 0) {
        res.json('Nenhuma tarefa concluída!');
    } if (concluida !== undefined) res.json(tarefasConcluidas);

    res.json(tarefas);
});

/* 
    método: GET
    URL: http://localhost:3000/tarefas
    resposta: [
    {
        "id": 1,
        "descricao": "Fazer compras",
        "concluida": false
    },
    {
        "id": 2,
        "descricao": "Estudar para a prova",
        "concluida": false
    },
    {
        "id": 3,
        "descricao": "Fazer exercícios",
        "concluida": false
    }
]
*/

/* 
    método: GET
    URL: http://localhost:3000/tarefas?concluida=true
    resposta: "Nenhuma tarefa concluída!"
*/

app.get('/tarefas/:id', (req, res) => {
    const { id } = req.params;
    const tarefa = tarefas.find(t => t.id === parseInt(id));
    if (!tarefa) res.status(404).json('Tarefa não encontrada');
    res.json(tarefa);
})

/* 
    método: GET
    URL: http://localhost:3000/tarefas/1
    resposta: {
    "id": 1,
    "descricao": "Fazer compras",
    "concluida": false
}
*/

app.post('/tarefas', [auth, validarTarefa, logger], (req, res) => {
    const { descricao } = req.body;
    const id = tarefas.length > 0 ? Math.max(...tarefas.map(t => t.id)) + 1 : 1; // o math.max vai puxar o maior id que já existe pra somar +1
    const novaTarefa = { id, descricao, concluida: false };
    tarefas.push(novaTarefa);
    res.status(201).json(novaTarefa);
});

/*  
    método: POST
    URL: http://localhost:3000/tarefas
    body: {
    "descricao": "terminar o projeto"
    }

    SEM MIDDLEWARES
    resposta: {
    "id": 4,
    "descricao": "terminar o projeto",
    "concluida": false
    }

    COM MIDLLEWARES
    resposta: {
    "id": 4,
    "descricao": "terminar o projeto",
    "concluida": false
    }
    CONSOLE
    Autenticando usuário...
    Usuário autenticado!
    2026-09-25T23:39:15.241Z - POST | /tarefas
*/

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`)
})