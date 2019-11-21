const downloadImage = require("./get_posts");
global.XMLHttpRequest = require("xhr2");
const { PythonShell } = require("python-shell");
const sha1 = require("sha1");
const parsedUrl = require('url');

exports.evaluate = async (req, res) => {
  const imagePath = parsedUrl.parse(req.url).query.substring(6,);
  const imageHash = sha1(imagePath) + '.jpg';
  const filelist = [imagePath];
  await downloadImage(filelist, imageHash);
  const score = await runPython(imageHash);
  await res.status(200).send(score);
};

runPython = imageHash => {
  console.log(imageHash);
  return new Promise((resolve, reject) => {
    PythonShell.run(
      "/workspace/functions/score.py",
      { args: [imageHash] },
      async (err, result) => {
        if (err) {
          if (err.traceback === undefined) {
            console.log(err.message);
          } else {
            console.log(err.traceback);
          }
        }
        const score = await result[result.length - 1];
        console.log(score);
        resolve(score);
      }
    );
  });
};
