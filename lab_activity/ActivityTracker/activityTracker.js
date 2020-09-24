/*
activityTracker.js v-0.1.4
Jake Levy
Sept 2020*/
var tracker = require("tracker");
var events = require("events");
var readline = require("readline");

const reader = readline.createInterface({
    input: process.stdin,//use std in as this reader's input/readable stream
    output: process.stdout // std out as the reader's output/writable stream
});

var exArr = [];
var current;
//A printing function that demonstrates how to use a forEach loop
//and callback
var viewAllEx = function(){
    count=0;
    exArr.forEach(value => {
	console.log(`Activity ${count+1}: ${value.getExercise()}`);
	console.log(`Calories:  ${value.calculate()}`);
	console.log(`Speed:     ${value.calcSpeed()}`);
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


var menu = function(){

    reader.question('Do you want to start over with a new (a)ctivity, (c)hange your current entry, (s)tore current activity to the array, (v)iew all activities or (e)xit?', answer=>{

	var letter = answer.toLowerCase()[0];
	switch (letter){
	case "a":
	   
	    response();//recall this function and start over again
	    break;
	    
	case "c":
	    //change the current activity
	    changeMenu();
	    break;  //Without break, this falls through & exits BEFORE setExercise completes
//
	case "s":
	    exArr.push(current);
	    menu();
	    break;
	case "v":
	    if (exArr.length > 0){
		viewAllEx();
	    } else{
		console.log("No Workouts to view");
	    }
	    menu();
	    break;

	case "w":
	    /*YOUR CODE HERE
	    Activity:
	    add code that will write the array of Exercises to a local file
	    Based on our discussion of local files and streams in Node:
	    Add a function that opens a file named myExercises for 'appending'.
	    Then stringify the array(chapter 5), and write it to myExercises (chapter 6).
	    Make sure to "clear" the array after it successfully writes.
	    */
	    break;
	    
	case "e":
	    
	    
	    viewAllEx();
	    console.log("Bye!");
	    process.exit(0);
	    //no break needed cause exit, duh
	default:
	    console.log("Unrecognized Option");
	    menu();
	    
	}
    });
}

var response = function(){
    //now that the constructor has been reduced to an empty/default, we could add all
    //the event listeners immediately if we wanted to
    current = new tracker();


    /*
      YOUR CODE HERE:
      Here you should add some code to see if there is a file named myExercises that exists
      in the local folder (chapter 6). If so,open it, read and  parse the contents (chapter 6),
    and push them into the local exArr array. In other words, load them.*/
    
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
				     
				     console.log("Recalculating");
				     console.log(`Updated Calories: ${current.calculate()}`);
				 });
				current.on('weightChanged', () => {
				    console.log("Recalculating");
				    console.log(`Updated Calories: ${current.calculate()}`);
				});
				current.on('distanceChanged', () => {
				    console.log("Recalculating");
				    console.log(`Updated Calories: ${current.calculate()}`);
				    console.log(`Updated Speed: ${current.calcSpeed()}`);
				});
				current.on('timeChanged', () => {
				    console.log("Recalculating");
				    console.log(`Updated Calories: ${current.calculate()}`);
				    console.log(`Updated Speed: ${current.calcSpeed()}`);
				});			
				menu();
				
			    })
	})
    })
})
}

response();  //start the response function

