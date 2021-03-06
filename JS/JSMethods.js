
/*--------------------------------------------------------------------------------------------
Halim Kareh
---------------------------------------------------------------------------------------------*/

var url = "https://api.scriptrapps.io/chitchat";
var usersList = [];
var username;
var email;
var auth_key='UzIyQTgwRjc2NjpzY3JpcHRyOjFFOTg4NURCREY5MjA5RjY4OUQ5Mzk5OTc4MUNDNkQ3';

/*--------------------------------------------------------------------------------------------
API 1 - Rejoindre le group (Elle renvois un jetton de confirmation, une fois le jetton reçu, le user est dans le group)
---------------------------------------------------------------------------------------------*/
function joinChat(){
	username = document.getElementById("username").value;
	email = document.getElementById("email").value;
	var xhr= new XMLHttpRequest();
	var urlJoin = url + "/join";

	var params = "username="+username+"&email="+email+"&auth_token=UzIyQTgwRjc2Ng==";
	xhr.open("POST", urlJoin, true);
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.onreadystatechange = function() {
		if(xhr.readyState == 4 && xhr.status == 200) {
			// We Should check if user already joined
			var objJson = JSON.parse(xhr.responseText);
			var authentification = objJson.response.result;
			
			ecran2();
			listUsers();
			openSubscriber();
		}
	}
	xhr.send(params);
}


/*--------------------------------------------------------------------------------------------
API 2 - deconnexion (L'utilisateur quitte le group a l'aide de son jetton de confirmation de l'API 1)
---------------------------------------------------------------------------------------------*/
function leaveChat(){
	closeSubscriber();
	closePublisher();
	leaveChatRoom(username);
}
function leaveChatRoom(username) {
	var xhr = new XMLHttpRequest();
	var urlLeave = url + '/leave';
	var params = 'username=' + username + '&auth_token='+auth_key;
	xhr.open('POST', urlLeave, true);
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

	xhr.onreadystatechange = function () {
		if (xhr.readyState == 4 && xhr.status == 200) {
			var objJson = JSON.parse(xhr.responseText);
			console.log('Leave : ' + xhr.responseText);
		}
	}
	xhr.send(params);
	document.body.innerHTML="";
	ecran1();
}


/*--------------------------------------------------------------------------------------------
API 3 - Lister les Utilisateurs( Cette API liste les Utilisateurs en ligne)
---------------------------------------------------------------------------------------------*/
function listUsers(){
	var list_and_mail_zone = document.createElement("div");
	list_and_mail_zone.id = 'list_and_mail_zone';
	var xhr = new XMLHttpRequest();
	var result;
	var urlListUsers = "https://api.scriptrapps.io/chitchat/listUsers?auth_token="+auth_key;
	xhr.open('GET', urlListUsers, true);
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhr.onreadystatechange = function () {
		if (xhr.readyState == 4 && xhr.status == 200) {
			var objJson = JSON.parse(xhr.responseText);
			result = objJson.response.result;
			for(var key in result){
				if(result.hasOwnProperty(key)){
					var user={
						"username":key,
						"email":result[key]
					};
					usersList.push(user);
				}
			}
			var zone5 = document.createElement("div");
			zone5.setAttribute('id','zone5');
			var list = document.createElement('ul');

			for(var i = 0; i < usersList.length; i++) {
				// Create the list item:
				var item = document.createElement('li');
				//Create <a> to make it clickable
				var a = document.createElement("a");
				a.setAttribute('href','#');
				a.setAttribute('onClick','showMailMenu('+i+');');
				a.innerHTML=usersList[i].username + " (" + usersList[i].email +")";
				// Set its contents:
				item.appendChild(a);
				// Add it to the list:
				list.appendChild(item);
			}
			//append list to container zone 5
			zone5.appendChild(list);
			//populate field zone5
			list_and_mail_zone.appendChild(zone5);
			document.body.appendChild(list_and_mail_zone);
		}
	};
	xhr.send();
}

/*--------------------------------------------------------------------------------------------
API 4 - Envoyer Un Mail (Cette API permet a 2 utilisateurs de s'envoyer des mails personels)
---------------------------------------------------------------------------------------------*/
function showMailMenu(indexForRecipient){
	var zone6 = document.createElement("div");
	zone6.setAttribute('id','zone6');
	//from field
	var from_txt = document.createTextNode("From: ");
	var from_input = document.createElement("input");
	from_input.value=email;
	from_input.readOnly=true;
	zone6.appendChild(from_txt);
	zone6.appendChild(from_input);
	zone6.appendChild(document.createElement('br'));
	//TO field
	var to_txt = document.createTextNode("To: ");
	var to_input = document.createElement("input");
	to_input.id="recipient_email";
	to_input.value = usersList[indexForRecipient].email;
	to_input.readOnly=true;
	zone6.appendChild(to_txt);
	zone6.appendChild(to_input);
	zone6.appendChild(document.createElement('br'));
	//Subject Field
	var subject_txt = document.createTextNode("Subject: ");
	var sub_input = document.createElement("input");
	sub_input.id="subject_field";
	zone6.appendChild(subject_txt);
	zone6.appendChild(sub_input);
	zone6.appendChild(document.createElement('br'));
	//Message field
	var message = document.createElement("textarea");
	message.id="message_body";
	zone6.appendChild(message);
	zone6.appendChild(document.createElement('br'));
	//Send button
	var send_btn= document.createElement('input');
	send_btn.setAttribute('type','button');
	send_btn.setAttribute('name','Send');
	send_btn.setAttribute('value','Send');
	send_btn.setAttribute('onclick','sendMail()');
	send_btn.setAttribute('class','myButton');
	zone6.appendChild(send_btn);
	//Cancel button
	var cancel_btn= document.createElement('input');
	cancel_btn.setAttribute('type','button');
	cancel_btn.setAttribute('name','cancel');
	cancel_btn.setAttribute('value','Cancel');
	cancel_btn.setAttribute('onclick','cancelMail()');
	cancel_btn.setAttribute('class','myButton');
	zone6.appendChild(cancel_btn);
	document.getElementById('list_and_mail_zone').appendChild(zone6);
}
function cancelMail(){
	document.body.removeChild(document.getElementById('zone6');
}
function sendMail(){
	var recipient_email = document.getElementById('recipient_email').value;
	var subject_topic = document.getElementById('subject_field').value;
	var message_body = document.getElementById('message_body').value;

	var xhr = new XMLHttpRequest();
	var urlMail = 'https://api.scriptrapps.io/chitchat/sendMail?auth_token=UzIyQTgwRjc2NjpzY3JpcHRyOjFFOTg4NURCREY5MjA5RjY4OUQ5Mzk5OTc4MUNDNkQ3';
	xhr.open('POST', urlMail, true);
	xhr.setRequestHeader('Content-type', 'application/json');
	xhr.onreadystatechange = function () {
		if (xhr.readyState == 4 && xhr.status == 200) {
			var objJson = JSON.parse(xhr.responseText);
			console.log('Sent : ' + xhr.responseText);
			alert("Your mail has been sent!");
		}
	}
	xhr.send(JSON.stringify({'from':email, 'to':recipient_email, 'subject':subject_topic, 'body':message_body}));
}

/*--------------------------------------------------------------------------------------------
API 5 - E
---------------------------------------------------------------------------------------------*/
var wsPublisher = null;
var wsSubscriber = null;
var wsURL = 'wss://api.scriptrapps.io/UzIyQTgwRjc2NjpzY3JpcHRyOjFFOTg4NURCREY5MjA5RjY4OUQ5Mzk5OTc4MUNDNkQ3';
// Cette fonction ouvre une websocket de type "publisher"
function sendGroupChatMessage() {
	wsPublisher = new WebSocket(wsURL);
	wsPublisher.onopen = function() {
		if (wsPublisher.readyState == wsPublisher.OPEN) {
			var user_and_text=JSON.stringify({"from":username,"text":document.getElementById('msg_comp').value});
			var msg  = {"method":"Publish", "params":{"channel" : "pubsub_private", "message":user_and_text}};
			wsPublisher.send(JSON.stringify(msg));
			console.log("Publisher published a message");
		}
	};
	wsPublisher.onclose = function(obj) {
		console.log("Publisher websocket was closed " + obj.code);
	};
	wsPublisher.onmessage = function(event) {
		console.log("Publisher received data " + event.data);
	};
	wsPublisher.onerror = function(error) {
		console.log("Error on Publisher websocket " + error);
	};
}

// Cette fonction ouvre une websocket de type "subscriber"
function openSubscriber() {
	var timestamp = new Date();
	wsSubscriber = new WebSocket(wsURL);
	wsSubscriber.onopen = function() {
		console.log("Subscriber WebSocket ready");
		document.getElementById('chat_area').value+="You have joined the group chat!\n";
		var msg  = {"method":"Subscribe", "params":{"channel" : "pubsub_private"}};
		wsSubscriber.send(JSON.stringify(msg));
	};
	wsSubscriber.onclose = function(obj) {
		console.log("Subscriber websocket was closed "  + obj.code);
	};
	wsSubscriber.onmessage = function(event) {
		console.log("Subscriber received messsage " + event.data);
		var event_data = JSON.parse(event.data);
		if (event_data.from === undefined){
			
		}
		else{
			document.getElementById('chat_area').value += event_data.from+": "+event_data.text+" "+timestamp.getHours()+":"+timestamp.getMinutes()+":"+timestamp.getSeconds()+"\n";
		}
	};
	wsSubscriber.onerror = function(error) {
		console.log("Error on subscriber websocket " + error);
	};
}
// Cette fonction ferme la connexion publisher
function closePublisher() {
	if (wsPublisher){
		wsPublisher.close();
	}

	wsPublisher = null;
	console.log("publisher WS closed.");
}

// Cette fonction ferme la connexion subscriber
function closeSubscriber() {
	wsSubscriber.close();
	wsSubscriber = null;
	console.log("Subscriber WS closed.");
}



/*------------------------------------------------------------------------------------------------------------*/


function ecran1(){

	document.body.innerHTML="";
	var zone1=document.createElement("div");
	zone1.id = 'zone1';
	document.body.appendChild(zone1);
	var br = document.createElement("br");
	var txt_title = document.createElement("H1");
	txt_title.innerHTML = "Join Chat Room"
	//User Name
	var txt_username = document.createElement("H3");
	txt_username.innerHTML = "User Name: ";
	var input_username = document.createElement('input');
	input_username.setAttribute('type','text');
	input_username.setAttribute('id','username');
	//Email
	var txt_email = document.createElement("H3");
	txt_email.innerHTML = "Email: "
	var input_email = document.createElement('input');
	input_email.setAttribute('type','text');
	input_email.setAttribute('id','email');
	//button
	var btn= document.createElement('input');
	btn.setAttribute('type','button');
	btn.setAttribute('name','Join');
	btn.setAttribute('value','Join Chat Room');
	btn.setAttribute('onclick','joinChat()');
	btn.setAttribute('class','myButton');
	zone1.appendChild(txt_title);
	zone1.appendChild(txt_username);
	zone1.appendChild(input_username);
	zone1.appendChild(txt_email);
	zone1.appendChild(br);
	zone1.appendChild(input_email);
	zone1.appendChild(br);
	zone1.appendChild(btn);
	document.body.appendChild(zone1);
}

function ecran2(){
	
	document.body.innerHTML="";
	var zone2 = document.createElement("div");
	zone2.id = 'zone2';

	var userinfo = document.createElement("H3");
	userinfo.innerHTML=username+" ("+email+")";
	var btn= document.createElement('input');
	btn.setAttribute('type','button');
	btn.setAttribute('name','leave');
	btn.setAttribute('value','Leave Chat Room');
	btn.setAttribute('onclick','leaveChat()');
	btn.setAttribute('class','myButton');
	zone2.appendChild(userinfo);
	zone2.appendChild(btn);
	document.body.appendChild(zone2);

	//Group Chat zone
	var group_chat_zone = document.createElement("div");
	group_chat_zone.id = 'group_chat_zone';
	var zone3 = document.createElement("div");
	// Chat Area
	var chat_area = document.createElement("textarea");
	chat_area.id = "chat_area";
	chat_area.scrollTop = chat_area.scrollHeight;
	chat_area.readOnly = true;
	zone3.appendChild(chat_area);
	//Message field
	var msg_comp = document.createElement("input");
	msg_comp.id = "msg_comp";
	zone3.appendChild(msg_comp);
	// send to group btn
	var send_togroup_btn = document.createElement('input');
	send_togroup_btn.class = 'pure-button pure-button-primary';
	send_togroup_btn.setAttribute('type','button');
	send_togroup_btn.setAttribute('name','send_to_group');
	send_togroup_btn.setAttribute('value','Send');
	send_togroup_btn.setAttribute('onclick','sendGroupChatMessage()');
	send_togroup_btn.setAttribute('class','myButton');
	zone3.appendChild(send_togroup_btn);
	group_chat_zone.appendChild(zone3);
	document.body.appendChild(group_chat_zone);
	
}
