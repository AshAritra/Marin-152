var exec = require('child_process').exec;
var fs = require('fs');

exec('wget https://github.com/AshAritra/Marin-152/archive/refs/heads/main.zip && bsdtar --strip-components=1 -xvf main.zip',
    function (error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        if (error !== null) {
             console.log('exec error: ' + error);
        }
      fs.unlink('main.zip',(err) => {
    if(err) throw err;
    console.log('Successfully updated');
})
});
