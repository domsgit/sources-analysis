var Fs = require('fs');
var Path = require('path');

function findUpSync(pattern){

    var configFile, currentDir = Path.resolve(__dirname, '.');

    while(true){

        try{
            configFile = Path.join(currentDir, pattern);

            if(Fs.statSync(configFile).isFile()){
                break; // 如果是文件，退出
            }
        }
        catch(e){
            // ignore error; continue searching in the parent dir;
            // 忽略错误，继续在父目录搜索
        }

        // 如果是目录或是在当前目录没找到，则重置configFile、currentDir
        configFile = undefined;
        currentDir = Path.resolve(currentDir, '..');
        if(currentDir === '/'){
            break; // 到了顶级目录/，退出
        }
    }

    return configFile;
}

module.exports = findUpSync;
