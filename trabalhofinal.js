var fs = require('fs');

let commandArray = []

function transform() {

    old_init = commandArray[0][0];

    let extra = [
        `; Semi-infinite to doubly infinite states\n`,
        `${commandArray[0][0]} * * l init`,
        `init _ £ r end`,
        `end * * r end`,
        `end _ ¢ l back_init`,
        `back_init * * l back_init`,
        `back_init £ £ r new_init`,
        `* £ £ r *`,
        `\n; Stop and end states`
    ]

    let stop_count = 0;
    let end_count = 0;
    commandArray = commandArray.map(function(commandString) {
        command = commandString.split(' ')
        if (command[0] == old_init) {
            command[0] = 'new_init'
        }
        if (command[1] == '_') {
            end_count++;
            command[1] = '§';
            extra.push(`\n; End state from state ${command[0]}`)
            extra.push(`${command[0]} ¢ § r end_state_${end_count}`)
            extra.push(`end_state_${end_count} _ ¢ l ${command[0]}`)
        }
        if (command[2] == '_') {
            command[2] = '§';
        }
        if (command[3] == '*') {
            stop_count++;
            command[3] = 'r';
            extra.push(`\n; Stop state from state ${command[0]}`)
            extra.push(`stop_state_${stop_count} * * l ${command[4]}`)
            command[4] = `stop_state_${stop_count}`
        }
        return command.join(' ');
    });

    extra.push(`\n; Machine states\n`)
    commandArray.splice(0, 0, extra.join('\n'));
}

fs.readFile('./maquina.in', 'utf-8', function (err, data) {
    if (err) throw err;

    var arr = data.split('\n').filter(line => line != '');

    arr.forEach(line => {
        commandArray.push(line)
    });

    transform();

    outputString = commandArray.join('\n');

    fs.writeFile('./maquina.out', outputString, { enconding: 'utf-8' }, function (err) {
        if (err) throw err;
        console.log('Sucesso!');
    });
});



