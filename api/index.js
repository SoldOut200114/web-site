const express = require("express");
const multiparty = require("multiparty");
const fs = require("fs");

const app = express();

app.use(express.json({ limit: "1024mb" }));
app.use('/imgs', express.static('imgs'));
app.use('/docs', express.static('docs'));


// 获取用户访问ip
const getRealIp = (req) => {
    return req.headers?.['x-real-ip'] || req.headers['x-forwarded-for'] || req.connection?.remoteAddress || req.socket.remoteAddress;
}

// 对获取数据进行排序
const sortImg = (data) => {
    const newData = data.sort(
        (a, b) => (b.likedNum || 0) - (a.likedNum || 0)
    );
    const topData = newData.filter(item => item.isTop);
    return [...topData, ...newData.filter(item => !item.isTop)]
}

// 获取图片列表接口
app.get("/listImg", (request, response) => {
    fs.readFile("./imgs/data.json", "utf8", (err, data) => {
        console.log(err, data);
        if (err) {
            response.send("hello world");
        } else {
            response.send({
                data: data
                    ? sortImg(JSON.parse(data))
                    : [],
            });
        }
    });
});

// 新增图片接口
app.post("/addImg", (request, response) => {
    const form = new multiparty.Form({ uploadDir: "./imgs" });
    form.parse(request, (err, fields, files) => {
        if (err) return;
        fs.readFile("./imgs/data.json", "utf8", (err, data) => {
            if (err) return;
            if (data) {
                const oldData = JSON.parse(data);
                const params = {
                    title: fields.title[0],
                    url: files.img[0].path,
                };
                oldData.push(params);
                fs.writeFile("./imgs/data.json", JSON.stringify(oldData), () => { });
                response.json({ url: files.img[0].path, title: fields.title[0] });
            } else {
                const params = {
                    title: fields.title[0],
                    url: files.img[0].path,
                };
                fs.writeFile("./imgs/data.json", JSON.stringify([params]), () => { });
                response.json({ url: files.img[0].path, title: fields.title[0] });
            }
        });
    });
});

// 获取当前访问者ip地址
app.get("/getIp", (req, res) => {
    const ip = getRealIp(req);
    res.send({ data: ip });
});

// 图片点赞，保存对应ip地址
app.post("/likeImg", (req, res) => {
    console.log(req.body);
    const { url } = req.body;
    fs.readFile("./imgs/data.json", "utf8", (err, data) => {
        if (!err) {
            const ip = getRealIp(req);
            const oldData = JSON.parse(data);
            const hadIps = oldData.find((item) => url === item.url)?.ips;
            if (hadIps && hadIps.length && hadIps.includes(ip)) {
                res.send({ msg: "今天你已点赞过该图片，请明天再来", error: true });
                return;
            }
            const newData = oldData.map((item) => {
                if (url === item.url) {
                    return {
                        ...item,
                        ips: item.ips ? [...item.ips, ip] : [ip],
                        likedNum: (item.likedNum || 0) + 1,
                    };
                }
                return item;
            });
            fs.writeFile("./imgs/data.json", JSON.stringify(newData), () => { });
            res.send({ data: ip });
        }
    });
});

// 删除图片
app.post("/del/img", (req, res) => {
    const { url } = req.body;
    fs.readFile("./imgs/data.json", "utf8", (err, data) => {
        if (!err) {
            const oldData = JSON.parse(data);
            const newData = oldData.filter(item => url !== item.url);
            try {
                fs.unlinkSync(`./${url}`, () => { })
                res.send({ data: '删除成功' });
            } catch (error) {
                res.send({ data: '删除失败' });
            }
            fs.writeFile("./imgs/data.json", JSON.stringify(newData), () => { });
        }
    })
})

// 删除每天的点赞ip地址
app.post("/del/ips", (req, res) => {
    fs.readFile("./imgs/data.json", "utf8", (err, data) => {
        if (!err) {
            const oldData = JSON.parse(data);
            const newData = oldData.map(item => {
                return {
                    ...item,
                    ips: []
                }
            });
            fs.writeFile("./imgs/data.json", JSON.stringify(newData), () => { });
            res.send({ data: '删除成功' });
        }
    })
})

// 新增文档接口
app.post("/addDoc", (request, response) => {
    const form = new multiparty.Form({ uploadDir: "./docs" });
    form.parse(request, (err, fields, files) => {
        if (err) return;
        const url = files.doc[0].path
        const params = {
            key: fields.key[0],
            url,
        };
        fs.readFile("./docs/data.json", "utf8", (err, data) => {
            if (err) return;
            if (data) {
                const oldData = JSON.parse(data);
                const savedData = oldData.find(item => item.key === params.key);
                if (savedData) {
                    fs.unlink(savedData.url, () => { });
                    savedData.url = params.url;
                    fs.writeFile("./docs/data.json", JSON.stringify(oldData), () => { });
                } else {
                    fs.writeFile("./docs/data.json", JSON.stringify([...oldData, params]), () => { });
                }
                response.json(params);
            } else {
                fs.writeFile("./docs/data.json", JSON.stringify([params]), () => { });
                response.json(params);
            }
        });
    });
});

// 获取文档接口
app.get("/getDoc", (request, response) => {
    fs.readFile("./docs/data.json", "utf8", (err, data) => {
        if (err) return
        const url = data ? JSON.parse(data).find(item => item.key === request.query.key)?.url : '';
        fs.readFile(`./${url}`, (err, doc) => {
            if (err) return;
            response.send(doc);
        })
        // response.send(url);
    });
});

// 获取文档菜单接口
app.get("/getDocMenus", (request, response) => {
    fs.readFile("./docs/menu.json", "utf8", (err, data) => {
        console.log(err, data);
        if (err) return
        response.send({
            data: data ? JSON.parse(data)
                : [],
        });
    });
});

// 新增文档菜单接口
app.post("/addDocMenu", (request, response) => {
    fs.readFile("./docs/menu.json", "utf8", (err, data) => {
        console.log(err, data);
        const params = request.body;
        if (err) return
        if (data) {
            const oldData = JSON.parse(data);
            oldData.push(params);
            fs.writeFile("./docs/menu.json", JSON.stringify(oldData), () => { });
            response.json(params);
        } else {
            fs.writeFile("./docs/menu.json", JSON.stringify([params]), () => { });
            response.json(params);
        }
    });
});

app.listen(9000);
