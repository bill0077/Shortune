var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

const { Resolver } = require('dns/promises');

console.log("[Server Start Running]\n\n")

var app = http.createServer(function(request,response){
  var _url = request.url;

  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;
  var ID = queryData.id;

  timestamp = new Date().getTime();
  date = new Date(timestamp); //타임스탬프를 인자로 받아 Date 객체 생성
  /* 생성한 Date 객체에서 년, 월, 일, 시, 분을 각각 문자열 곧바로 추출 */
  var year = date.getFullYear().toString().slice(-2); //년도 뒤에 두자리
  var month = ("0" + (date.getMonth() + 1)).slice(-2); //월 2자리 (01, 02 ... 12)
  var day = ("0" + date.getDate()).slice(-2); //일 2자리 (01, 02 ... 31)
  var hour = ("0" + date.getHours()).slice(-2); //시 2자리 (00, 01 ... 23)
  var minute = ("0" + date.getMinutes()).slice(-2); //분 2자리 (00, 01 ... 59)
  var second = ("0" + date.getSeconds()).slice(-2); //초 2자리 (00, 01 ... 59)
  var returnDate = year + "." + month + "." + day + ". " + hour + ":" + minute + ":" + second;


  //console.log(__dirname + _url);    

  if(ID!=null){
    console.log("server access")
    //console.log("[ID] = " + ID + "\n[TIME] = " + returnDate + "\n");
    fs.appendFileSync('data/timeline.txt', `[ID] = ${ID}, [TIME] = ${returnDate}\n`);
    //console.log(_url);

    /*survey 파일 값 갱신*/
    let rawdata = fs.readFileSync(`data/survey.txt`);
    let surveydata = JSON.parse(rawdata);

    surveydata.VIEWS_total+=1;
    if(ID=='everytime') {
      surveydata.VIEWS_IDeverytime+=1;
    }
    else if(ID=='instagram') {
      surveydata.VIEWS_IDinstagram+=1;
    }

    var update_survey=`
{
  "VIEWS_total":${surveydata.VIEWS_total},
  "VIEWS_IDeverytime":${surveydata.VIEWS_IDeverytime},
  "VIEWS_IDinstagram":${surveydata.VIEWS_IDinstagram},

  "AGE_undergraduate1":${surveydata.AGE_undergraduate1},
  "AGE_undergraduate2":${surveydata.AGE_undergraduate2},
  "AGE_undergraduate3":${surveydata.AGE_undergraduate3},
  "AGE_undergraduate4":${surveydata.AGE_undergraduate4},
  "AGE_graduate":${surveydata.AGE_graduate},
  "AGE_else":${surveydata.AGE_else},

  "MAINFUNC_answersheet":${surveydata.MAINFUNC_answersheet},
  "MAINFUNC_quenansw":${surveydata.MAINFUNC_quenansw}
}`

    //fs.writeFileSync(`data/survey.txt`, JSON.stringify(surveydata), "utf8");
    fs.writeFileSync(`data/survey.txt`, update_survey, "utf8");
    /*갱신 끝*/

    /*index.html로 리다이렉트*/
    response.writeHead(302, {
      Location: `/index.html`
    }).end();
  }


  if(request.url == '/'){
    console.log("server access")
    fs.appendFileSync('data/timeline.txt', `[ID] = _NONE_, [TIME] = ${returnDate}\n`);
    _url = '/index.html';

    /*survey 파일 값 갱신*/
    let rawdata = fs.readFileSync(`data/survey.txt`);
    let surveydata = JSON.parse(rawdata);

    surveydata.VIEWS_total+=1;

    var update_survey=`
{
  "VIEWS_total":${surveydata.VIEWS_total},
  "VIEWS_IDeverytime":${surveydata.VIEWS_IDeverytime},
  "VIEWS_IDinstagram":${surveydata.VIEWS_IDinstagram},

  "AGE_undergraduate1":${surveydata.AGE_undergraduate1},
  "AGE_undergraduate2":${surveydata.AGE_undergraduate2},
  "AGE_undergraduate3":${surveydata.AGE_undergraduate3},
  "AGE_undergraduate4":${surveydata.AGE_undergraduate4},
  "AGE_graduate":${surveydata.AGE_graduate},
  "AGE_else":${surveydata.AGE_else},

  "MAINFUNC_answersheet":${surveydata.MAINFUNC_answersheet},
  "MAINFUNC_quenansw":${surveydata.MAINFUNC_quenansw}
}`

    //fs.writeFileSync(`data/survey.txt`, JSON.stringify(surveydata), "utf8");
    fs.writeFileSync(`data/survey.txt`, update_survey, "utf8");
    /*갱신 끝*/

    response.writeHead(302, {
      Location: `/index.html`
    }).end();
  }
  else if(fs.existsSync(__dirname + _url)){
    response.writeHead(200);
    response.end(fs.readFileSync(__dirname + _url));
  }
  else if(pathname == "/submit_form") {
    var body=''
    request.on('data', function(data) {
      body = body + data;
    });
    request.on('end', function() {
      var post = qs.parse(body);

      /*fs.writeFile(`data/survey_results`, "test_text", "utf8", function(err){
        console.log(ID);
        response.writeHead(200);
        response.end('success');
      })*/

      /*설문 조사 결과 갱신*/
      let rawdata = fs.readFileSync(`data/survey.txt`);
      let surveydata = JSON.parse(rawdata);

      if(post.func=='answer-sheet') {
        surveydata.MAINFUNC_answersheet+=1;
      }
      else if(post.func=='que-n-answ') {
        surveydata.MAINFUNC_quenansw+=1;
      }

      if(post.age=='undergraduate-1') {
        surveydata.AGE_undergraduate1+=1;
      }
      else if(post.age=='undergraduate-2') {
        surveydata.AGE_undergraduate2+=1;
      }
      else if(post.age=='undergraduate-3') {
        surveydata.AGE_undergraduate3+=1;
      }
      else if(post.age=='undergraduate-4') {
        surveydata.AGE_undergraduate4+=1;
      }
      else if(post.age=='graduate') {
        surveydata.AGE_graduate+=1;
      }
      else if(post.age=='else') {
        surveydata.AGE_else+=1;
      }

      var update_survey=`
{
  "VIEWS_total":${surveydata.VIEWS_total},
  "VIEWS_IDeverytime":${surveydata.VIEWS_IDeverytime},
  "VIEWS_IDinstagram":${surveydata.VIEWS_IDinstagram},

  "AGE_undergraduate1":${surveydata.AGE_undergraduate1},
  "AGE_undergraduate2":${surveydata.AGE_undergraduate2},
  "AGE_undergraduate3":${surveydata.AGE_undergraduate3},
  "AGE_undergraduate4":${surveydata.AGE_undergraduate4},
  "AGE_graduate":${surveydata.AGE_graduate},
  "AGE_else":${surveydata.AGE_else},

  "MAINFUNC_answersheet":${surveydata.MAINFUNC_answersheet},
  "MAINFUNC_quenansw":${surveydata.MAINFUNC_quenansw}
}`

      fs.writeFileSync(`data/survey.txt`, update_survey, "utf8");

      //fs.writeFileSync(`data/survey.txt`, JSON.stringify(surveydata), "utf8");
      /*갱신 끝*/

      console.log("survey submited");
      //console.log(post);
    });

    /*설문 완료 페이지로 리다이렉트*/
    response.writeHead(302, {
      Location: `/survey_submitted.html`
    }).end();
  
  }
  else {
    response.writeHead(404);
    response.end();
  }


});
app.listen(3000);