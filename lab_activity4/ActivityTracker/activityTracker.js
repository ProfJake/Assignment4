var tracker = require("tracker");
var events = require("events");
var readline = require("readline");

const reader = readline.createInterface({
    input: process.stdin,//use std in as this reader's input/readable stream
    output: process.stdout // std out as the reader's output/writable stream
});

//Notice something interesting here about the current var.  I have access to it
//in the menu function EVEN though it is declared "for the first time" AFTER
//menu.

//This is because var declarations have what is known as "function scope".  They are
//initialized with a value of "undefined" when used, if they not yet been declared.
//This means that they are accessible (even if undefined) in their enclosing
//scope before they are declared.

//Another available declaration statement is "let", as in "let x = 5;"
//let declarations have only "block scope", meaning they are only available
//within the block in which they are defined.

//Here I don't call menu until after I have declared and defined "current".
//So by the time menu is called, current has the correct value.
//current is available because it was declared with var.

var menu = function(){
				
    reader.question('Do you want to start over with a new (a)ctivity, (c)hange your current entry, (s)tore current activity and start over, (v)iew all activities or (e)xit?', answer=>{

	var letter = answer.toLowerCase()[0];
	switch (letter){
	case "a":
	   
	    response();//recall this function and start over again
	    break;
	    
	case "c":
	    //change the current activity
	    changeMenu();
	    break;  //Without break, this falls through & exits BEFORE setExercise completes

	case "s":
	    exArr.push(current);
	    response();
	    break;
	case "v":
	
	    menu();
	    break;
	case "e":

	    
	    exArr.push(current);
	    viewAllEx();
	    //Activity
	    //on exit write the array of Exercises to a local file
	    console.log("Bye!");
	    process.exit(0);
	    //no break needed cause exit, duh
	default:
	    console.log("Unrecognized Option");
	    menu();
	    
	}
    });
}
		   
var viewAllEx = function(){
    count=0;
    exArr.forEach(value => {
	console.log(`Activity ${count+1}: ${value.getExercise()}`);
	console.log(`Calories:  ${value.calculate()} `);
	count++;
    });
}
	
var changeMenu = function(){
	    reader.question("Which member do you want to change? (e)xercise, (w)eight, (t)ime, (d)istance, or (n)o change?", choice => {
		letter = choice.toLowerCase()[0];
		switch (letter){
		case "e":
		    reader.question('What is your new activity (Swimming/Walking/Running)', rep=>{
			current.setExercise(rep);
			menu();
		    });
			break;
		case "w":
			reader.question('What is your new weight?', nWeight =>{
			    current.setWeight(nWeight);
			    menu();
			});
		    break;
		case "t":
		    reader.question('What is your new time?', nTime => {
			current.setTime(nTime);
			menu();
		    });
		    break;
		case "d":
		    reader.question('What is your new distance?', nDist => {
			current.setDistance(nDist)
			menu();
		    });
		    
		    break;
		case "n":
		    menu();
		    break;
		default:
		    console.log("Unrecognized Choice!");
		    changeMenu();
		}
		//Normally you might want to put the menu() call here
		//to ensure it runs after everything else.  But because
		//Node is Asynchronous, putting menu here does not ensure
		//anything.  It might run before the setMember callbacks
		//complete.  So we have to chain it to the callbacks.
	    });

}
var exArr = [];
var current;
var response = function(){
    //now that the constructor has been reduced to an empty/default, we could add all
    //the event listeners immediately if we wanted to
    current = new tracker();

    reader.question('What actvity did you perform? \
(Walking/Running/Swimming)', act => {
   
    current.setExercise(act);
    reader.question('For how long? (in minutes)', time =>{
	current.setTime(time);
	reader.question('How far? (in miles)', distance => {
	    current.setDistance(distance);
	    reader.question('What is your weight today? (in pounds)', weight =>
			    {
				//Notice that current scope is still able to
				//capture data provided in previous callbacks.
				current.setWeight(weight);
				console.log(`Calories Burned: ${current.calculate()}`);

				 current.on('exerciseChanged', () => {
				    console.log("Exercise Changed!");
				    console.log(`Calories Burned: ${current.calculate()}`);
				 });
				
				menu();
				
			    })
	})
    })
})
}

//Actvity:
// Based on our discussion of local files and streams in Node:
//Add a function that checks to see if a file named myExercises exists already
//If not, your function should create it and then proceed with the rest of the program.
//If it does exist, read the file contents and store them in exArr array (restore all
//previously entered exercises). Then proceed with the rest of the program.

//Upon exiting, your program should store the contents of the exArr into the file
//as binary data (overwriting the previous contents of the file if it already exists)

response();  //start the response function

