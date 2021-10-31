var answer;
var score = 0;
var backimage = [];

var math_imported=true

function nextquestion() {

    const n1 = Math.ceil(Math.random() * 4);
    const n2 = Math.floor(Math.random() * 6);

    document.getElementById('n2').innerHTML = n2
    document.getElementById('n1').innerHTML = n1;

    answer = n1 + n2;

    console.log('yolo');

}

function check() {

    const prediction = predictImage();
    console.log(`prediction : ${prediction}`);



    if (prediction == answer) {

        score++;

        if (score<=6){

        
        backimage.push(`url('images/background${score}.svg')`);
        document.body.style.backgroundImage = backimage;
        }

        else {

            alert('Congratulations');
            score = 0;
            backimage = [];
            document.body.style.backgroundImage = backimage;

        }
    }
    else {
        if (score != 0) {
            
            score--;
            alert('Check calc / write neater');

            setTimeout(function () {

                backimage.pop();
                document.body.style.backgroundImage = backimage;
                
            } , 1000)
        }
    }

}