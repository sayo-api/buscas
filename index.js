const {
 TelegramClient
} = require("telegram");
const {
 StringSession
} = require("telegram/sessions");
const {
 NewMessage
} = require("telegram/events");
const {
 EditedMessage,
 EditedMessageEvent
} = require("telegram/events/EditedMessage");
const input = require("input");
const app = require("express")();
const fs = require("fs");
const db = JSON.parse(fs.readFileSync("db.json"));

const apiId = "14722796";

const apiHash = "d9dfe5db3a435335e3d3a1aa920af5a5";

const stringSession = new StringSession(
 "1AQAOMTQ5LjE1NC4xNzUuNjABuxYHijHkOX29JLT1o7QxB3CJrkSBQKmCw5jM+LtfRGGVIguBhkwFnu/8cLR+C+gchBXIuAk2PpyHZXRs7AGgxTJYSjGKT64k7YZhBcC5iVL1ydUOsNrx3kLO1Qt0A1+NNoxsXe3c7A0pojHitkqstyIEUgpBSvRDgnV5vYMTJvjdXH3Iut1bLCxLZuo04YVYoqn3CYq+7dY6dEPdERC25yu8zfG+k3Sr5/4yjidFVZETGg233ka01CJaXhnjCtRx6gEEDs+Ejzp1ylDVjvTnTRnWHB0MNNik0p/aveqaakus1RwQssY6F+CBT36nve58RNTja81asydF7AXI6XqlTo0="
);

/*const apiId = "13491147";
const apiHash = "85950b18c890967ffc8864c0bfbbcd85";
const stringSession = new StringSession(
 "1AQAOMTQ5LjE1NC4xNzUuNTgBuy8dVfqMjpOGaZVezrB2n0ESvIET+A+f5iRKO7K5dEaSs6nI95FNi6WzvWgmaYLviHCgRpvIUrmrtPKk97CZHJYW3i/2XC00g4RRWKbx+seUC/9EHtDJ2dCZj9vt8muaOas89KXmGT4+UHlKcY+oRSBgtrgpOMzleqKVEPyOrFszqPWc7iFFSyBgzdd+DlQj8jJdHZ7wZDyptjN3HSrrwxQXnwLsmDRCPmE/x48NJuvfZmGcyCoG47YrRZ0iWOAFhcEeov6UrQjLZkRyHIYyUDJx7DcVzYT58gKTePVpGwa0IVlJUJHDsA3QrizOOHUJ+4Fk3ImDXtwOrgJzUckjNb8="
);*/

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("WebSite Online na porta:", port));

const telegram = new TelegramClient(stringSession, apiId, apiHash, {
 connectionRetries: 5
});
(async () => {
 await telegram.start({
  phoneNumber: "5511959584518",
  password: async () => await input.text("seu numero"),
  phoneCode: async () =>
  await input.text("seu codigo"),
  onError: (err) => console.log(err)
 });
 console.log("TELEGRAM: Conectado com sucesso!");
 console.log(telegram.session.save());
 await telegram.sendMessage("me", {
  message: "To Online!"
 });
})();
 

app.get("/:type/:q", async (req, res) => {
 const type = req.params.type.toLowerCase() || '';
 const query = req.params.q.toLowerCase() || '';
 numero = query
 if (!numero) return res.json({
  status: false, criador: `${criador}`, mensagem: "Coloque o tipo da consulta"
 })
 if (type.search(/cpf1|cpf2|cpf3|tel1|tel2|nome|nome2|score|score2|placa1|placa2|cnpj|bin|cep|ip|site|vizinhos|rg|nascimento/) === -1)
  return res.json({
  http_code: 400,
  error: 'Tipo de consulta invalida'
 });
 console.log(`[CONSULTA] Brenooots: ${type} = ${query}`);
 if (db && db[type] && db[type][query]) return res.json({
  http_code: 200,
  resultado: db[type][query]
 });
 if (query === "1799113416") return res.json({
  http_code: 500,
  error: "Este numero esta proibido de ser consultado!"
 })
 const Consultar = {
  cpf() {
   if (query.length != 11) return res.json({
    http_code: 400,
    error: "Cpf deve conter 11 digitos"
   })
   telegram.sendMessage('MkBuscasRobot', {
    message: `/cpf1 ${query}`
   })
   .catch((e) => res.json({
    http_code: 500,
    error: "Não foi possível fazer a consulta"
   }));
  },
  all() {
   if (query.length != 11) return res.json({
    http_code: 400,
    error: "Cpf deve conter 11 digitos"
   })
   telegram.sendMessage(Grupos[3].bot, {
    message: `/cpf2 ${query}`
   })
   .catch((e) => res.json({
    http_code: 500,
    error: "Não foi possível fazer a consulta"
   }));
  }
 }
 if (Consultar[type]) Consultar[type]();
 else await telegram.sendMessage('MkBuscasRobot', {
  message: `/${type} ${query}`
 })
 .catch((e) => {
  res.json({
   http_code: 500,
   error: "Não foi possível fazer a consulta"
  })
  console.log("DEBUG NO CÓDIGO:", e)
 });
 async function OnMsg(event) {
  const message = event.message;
  const textPure =
  message && message.text ?
  message.text:
  message && message.message ?
  message.message: '';
  const text =
  message && message.text ?
  message.text.toLowerCase():
  message && message.message ?
  message.message.toLowerCase(): '';
  const msgMarked = await message.getReplyMessage();
  const msgMarkedText =
  msgMarked && msgMarked.text ?
  msgMarked.text.toLowerCase():
  msgMarked && msgMarked.message ?
  msgMarked.message.toLowerCase(): '';
  const sender = await message.getSender();
  const senderId = sender && sender.username ? sender.username: '';
  const chat = await message.getChat();
  const chatId = chat && chat.username ? chat.username: '';
   try {
    if ((chatId == 'MkBuscasRobot' && senderId == 'MkBuscasRobot') &&
     ((msgMarkedText.includes(query)) ||
      text.includes(query))) {
     achou = true;
     await telegram.markAsRead(chat);
     //console.log(`text: ${textPure}, msgMarked: ${msgMarkedText}`)
     if (text.includes("NÃO ENCONTRADO"))
      return res.json({
      http_code: 200,
      resultado: 'NÃO ENCONTRADO',
      dono: "Breno"
     });
     if (text.includes("INVÁLIDO!"))
      return res.json({
      http_code: 200,
      resultado: 'INVÁLIDO',
      dono: "Breno"
     });
     if (message.media) {
      if (message.media.hasOwnProperty("photo")) {
       const buffer = await telegram.downloadMedia(message.photo, {});
       let json = {
        image: true,
        file: false,
        base64: Buffer.from(buffer).toString("base64")
       };
       db[type][query] = json;
       fs.writeFileSync("db.json", JSON.stringify(db, null, "\t"));
       return res.json(json);
      } else if (message.media.hasOwnProperty("document")) {
       const buffer = await telegram.downloadMedia(message, {});
       let json = {
        image: false,
        file: true,
        base64: Buffer.from(buffer).toString("base64")
       }
       db[type][query] = json;
       fs.writeFileSync("db.json", JSON.stringify(db, null, "\t"));
       return res.json(json);
      }
     }
    }
    if ((chatId == 'MkBuscasRobot' && senderId == 'MkBuscasRobot') &&
     ((msgMarkedText.includes(query)) &&
      text.includes(query))) {
     achou = true;
     await telegram.markAsRead(chat);
     let str = textPure;

     str = str.replace(/🔛 \*\*BY:\*\* @MkBuscasRobot|\*\*|• |`|🔍 | 🔍/gi, "");
     str = str.replace(/\n\n\n|USUÁRIO: ayumi sus/gi, '');
     str = str.replace(/CONSULTA DE TELEFONE\n\n/gi, '');
     str = str.replace(/CONSULTA DE CPF\n\n/gi, '');
     str = str.replace(/• USUÁRIO: ayumi sus/gi, '');
     str = str.replace(/\n\n• USUÁRIO:  ayumi sus\n\nBY: @FragBuscasBot/gi, '');
     str = str.replace(/USUÁRIO: ayumi sus/gi, '');
     str = str.replace(/USUÁRIO: ayumi sus/gi, '');
     str = str.replace(/USUÁRIO: ayumi/gi, '');     
str = str.replace(/REF: @refmkbuscas/gi, '');
     str = str.replace(/𝗖𝗢𝗡𝗦𝗨𝗟𝗧𝗔 𝗗𝗘 𝗖𝗣𝗙\n\n/gi, '');
     str = str.replace(/𝗖𝗢𝗡𝗦𝗨𝗟𝗧𝗔 𝗗𝗘 𝗣𝗟𝗔𝗖𝗔\n\n/gi, '');
     str = str.replace(/𝗖𝗢𝗡𝗦𝗨𝗟𝗧𝗔 𝗗𝗘 𝗧𝗘𝗟𝗘𝗙𝗢𝗡𝗘\n\n/gi, '');
     str = str.replace(/\n\nBY: @MkBuscasRobot/gi, '');
     str = str.replace("@MkBuscasRobot", '');     
     /*let json = {};
					const linhas = str.split("\n");
					for (const t of linhas) {
						const key = t.split(": ");
						key[0] = key[0]
							.replace(/\//g, " ")
							.toLowerCase()
							.replace(/(?:^|\s)\S/g, function (a) {
								return a.toUpperCase();
							})
							.replace(/ |•|-|°|/g, "");
						json[key[0]] = key[1];
					}*/
     if (db && db[type]) db[type][query] = str;
     else db[type] = {},
     db[type][query] = str;
     fs.writeFileSync("db.json", JSON.stringify(db, null, "\t"));
     res.json({
      http_code: 200,
      resultado: str,
      dono: "Breno"
     });
    }
    return;
   } catch (e) {
    if (achou) return;
    res.json({
     http_code: 500,
     error: "error no servidor, não foi possivel fazer a consulta"
    })
    console.log(e);
   }
  
 }
 async function OnEditedMsg(event) {
  try {
   const message = event.message;
   const textPure = message.text || message.message;
   const text = message.text.toLowerCase() || message.message.toLowerCase();
   const sender = await message.getSender();
   const senderId = sender && sender.username ? sender.username: '';
   const chat = await message.getChat();
   const chatId = chat && chat.username ? chat.username: '';
   const msgMarked = await message.getReplyMessage();
   const msgMarkedText = msgMarked.text.toLowerCase() || msgMarked.message.toLowerCase();
    try {
     if ((chatId == 'MkBuscasRobot' && senderId == 'MkBuscasRobot') &&
      ((msgMarkedText.includes(query)) ||
       text.includes(query))) {
      achou = true;
      if (text.includes("não encontrad"))
       return res.json({
       http_code: 200,
       error: "não encontrado"
      });
      if (text.includes("inválid"))
       return res.json({
       http_code: 400,
       error: "invalido"
      });
      if (message.media) {
       if (message.media.hasOwnProperty("photo")) {
        const buffer = await telegram.downloadMedia(message.photo, {});
        let json = {
         image: true,
         file: false,
         base64: Buffer.from(buffer).toString("base64")
        };
        db[type][query] = json;
        fs.writeFileSync("db.json", JSON.stringify(db, null, "\t"));
        return res.json(json);
       } else if (message.media.hasOwnProperty("document")) {
        const buffer = await telegram.downloadMedia(message, {});
        let json = {
         image: false,
         file: true,
         base64: Buffer.from(buffer).toString("base64")
        }
        db[type][query] = json;
        fs.writeFileSync("db.json", JSON.stringify(db, null, "\t"));
        return res.json(json);
       }
      }
      let str = textPure;


      /*let json = {};
						const linhas = str.split("\n");
						for (const t of linhas) {
							const key = t.split(": ");
							key[0] = key[0]
								.replace(/\//g, " ")
								.toLowerCase()
								.replace(/(?:^|\s)\S/g, function (a) {
									return a.toUpperCase();
								})
								.replace(/ |•|-|°|/g, "");
							json[key[0]] = key[1];
						}*/
      if (db && db[type]) db[type][query] = str;
      else db[type] = {},
      db[type][query] = str;
      fs.writeFileSync("db.json", JSON.stringify(db, null, "\t"));
      res.json({
       http_code: 200,
       resultado: str,
       dono: "Breno"
      });
     }
     return;
    } catch (e) {
     if (achou) return;
     res.json({
      http_code: 500,
      error: "error no servidor, não foi possivel fazer a consulta"
     })
     console.log(e);
    }
   
  } catch (e) {
   if (achou) return;
   res.json({
    http_code: 500,
    error: "error no servidor, não foi possivel fazer a consulta"
   })
   console.log(e);
  }
  }
 telegram.addEventHandler(OnMsg, new NewMessage({}));
 //telegram.addEventHandler(OnEditedMsg, new EditedMessage({}));
 setTimeout(() => {
  if (achou) return;
  res.json({
   http_code: 500,
   error: "servidor demorou muito para responder"
  });
 },
  20000);
});
