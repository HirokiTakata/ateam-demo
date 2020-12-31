const express = require('express'); // expressモジュールを読み込む
const multer = require('multer'); // multerモジュールを読み込む
const uuidv4 = require('uuid/v4'); // uuidモジュールを読み込む

const app = express(); // expressアプリを生成する
app.use(multer().none()); // multerでブラウザから送信されたデータを解釈する
app.use(express.static('web')); // webフォルダの中身を公開する

// レシピリストデータ
const recipeList = [];

const mysql = require('mysql');
const connection = mysql.createConnection({
  host: '',
  user: '',
  password: '',
  database: 'recipes'
});
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected!');
});
 
connection.query('SELECT * FROM recipes', (err,rows) => {
  if(err) throw err;
 
  console.log('Data received from Db:\n');
  for(let i=0;i<rows.length;i++){
    recipeList.push(rows[i]);
  }
});

// http://localhost:3000/api/v1/list にアクセスしてきたときに
// レシピリストを返す
app.get('/recipes', (req, res) => {
    // JSONを送信する
    res.json(recipeList);
});

app.get('/recipes/:id', (req, res) => {
    const index = recipeList.findIndex((item) => item.id === req.params.id);

    // 項目が見つかった場合
    if(index >= 0) {
        const got = recipeList[index]; // indexの位置にある項目を取得
        res.json(got);

    }
    
    // JSONを送信する
    res.json(recipeList);
});

// 例えば、http://localhost:3000/api/v1/add にデータを送信してきたときに
// TODOリストに項目を追加する
app.post('/recipes', (req, res) => {
    // クライアントからの送信データを取得する
    const recipeData = req.body;
    const recipeTitle = recipeData.title;
    const recipeMakingTime = recipeData.making_time;
    const recipeServes = recipeData.serves;
    const recipeIngredients = recipeData.ingredients;
    const recipeCost = recipeData.cost;

    // ユニークIDを生成する
    const id = uuidv4();

    // TODO項目を作る
    const recipe = {
        id,
        title: recipeTitle,
        making_time: recipeMakingTime,
        serves: recipeServes,
        ingredients: recipeIngredients,
        cost: recipeCost
    };

    // TODOリストに項目を追加する
    recipeList.push(recipe);

    // コンソールに出力する
    console.log('Add: ' + JSON.stringify(recipe));

    // 追加した項目をクライアントに返す
    res.json(recipe);
});

// 例えば、http://localhost:3000/api/v1/item/:id にDELETEで送信してきたときに
// 項目を削除する。:idの部分にはIDが入る
// 例
// http://localhost:3000/api/v1/item/cc7cf63c-ccaf-4401-a611-f19daec0f74e
// にDELETEメソッドでアクセスすると、idがcc7cf63c-ccaf-4401-a611-f19daec0f74eのものが削除される
app.delete('/recipes/:id', (req, res) => {
    // URLの:idと同じIDを持つ項目を検索
    const index = recipeList.findIndex((item) => item.id === req.params.id);

    // 項目が見つかった場合
    if(index >= 0) {
        const deleted = recipeList.splice(index, 1); // indexの位置にある項目を削除
        console.log('Delete: ' + JSON.stringify(deleted[0]));
    }

    // ステータスコード200:OKを送信
    res.sendStatus(200);
});

// DELETEとほぼ同じ
app.patch('/recipes/:id', (req, res) => {
    // URLの:idと同じIDを持つ項目を検索
    const index = recipeList.findIndex((item) => item.id === req.params.id);

    // 項目が見つかった場合
    if(index >= 0) {
        const item = recipeList[index];
        if(req.body.done) {
            item.done = req.body.done === 'true';
        }
        console.log('Edit: ' + JSON.stringify(item));
    }

    // ステータスコード200:OKを送信
    res.sendStatus(200);
});

// ポート3000でサーバを立てる
app.listen(3000, () => console.log('Listening on port 3000'));
