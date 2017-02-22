
module.exports = function (controller) {
  // this is triggered when a user clicks the send-to-messenger plugin
  controller.on('facebook_optin', function (bot, message) {
    npsSurveyStart(bot, message)
  })
  // user said hello
  controller.hears(['hello', 'hi'], 'message_received', function (bot, message) {
    bot.reply(message, "hey there!");
  });
  controller.hears(['NPS'], 'message_received', function (bot, message) {
    npsSurveyStart(bot, message)
  });

  controller.hears(['True', 'False'], 'message_received', function(bot, incoming) {
    bot.reply(incoming, {text: "We’re not sure either, but from what we hear…"});
    setTimeout(function() {
      bot.reply(incoming, {text: "According to the financial reports of the three largest credit card companies in the world, there were over 1,635 million cards in circulation in 2013: Visa had 800 million, MasterCard had 731 million, and American Express had 104 million."});
      setTimeout(function() {
        bot.reply(incoming, {text: "If you placed all those cards side by side, you could span 86,981 miles: the equivalent of three and a half trips around the world."});
        setTimeout(function() {
          bot.reply(incoming, {text: "We look forward to talking to you again in our next activity."});
        }, 1000)
      }, 3000)
    }, 1000)
  });
  controller.hears(['Restart'], 'message_received', function(bot, incoming) {
    npsSurveyStart(bot, message)
  });

  controller.hears(['what can I do here?'], 'message_received', function(bot, message) {
      bot.reply(message, "You can do a super short NPS survey!");
  });

  controller.hears(['help'], 'message_received', function(bot, message) {
      bot.reply(message, "type 'NPS'");
  });


function npsSurveyStart(bot, incoming) {
  bot.startConversation(incoming, function(err, convo) {
    convo.ask({
        text: `Based on your experience with ACME, how likely would you be to recommend ACME to a friend, family member or colleague?`,
        quick_replies: [
            {
                "content_type": "text",
                "title": "😍 Extremely likely",
                "payload": "10",
            },
            {
                "content_type": "text",
                "title": "<<--",
                "payload": "9",
            },
            {
                "content_type": "text",
                "title": "😃 Likely",
                "payload": "8",
            },
            {
                "content_type": "text",
                "title": "<--",
                "payload": "7",
            },
            {
                "content_type": "text",
                "title": "Neutral",
                "payload": "6",
            },
            {
                "content_type": "text",
                "title": "-->",
                "payload": "5",
            },
            {
                "content_type": "text",
                "title": "😒 Not likely",
                "payload": "4",
            },
            {
                "content_type": "text",
                "title": "-->>",
                "payload": "3",
            },
            {
                "content_type": "text",
                "title": "😠 Not likely at all",
                "payload": "2",
            },
            {
                "content_type": "text",
                "title": "I do not use banks",
                "payload": "1",
            }
        ]
    }, function(response, convo) {
      convo.stop()
      if (+response.payload <= 7){
        unhappyProbe(bot, incoming)
      } else if (+response.payload === 10 ){
        happyProbe(bot, incoming)
      } else if (+response.payload === 1 ){
        noBanks(bot, incoming)
      } else if (+response.payload < 10 && +response.payload >= 8 ){
        semihappyProbe(bot, incoming)
      } else {
      }
    });
  });
}
function noBanks(bot, incoming){
  bot.reply(message, "I heard Bill gates say \"Banking is necessary, banks are not!\"");
  setTimeout(function() {
    activity(bot, incoming)
  }, 1000)
}

function unhappyProbe(bot, incoming){
  bot.reply(incoming, {
      text: `Sorry to hear that you are not happy with ACME!`,
  });
  bot.startConversation(incoming, function(err, convo) {
    convo.ask({
      text: "In a few words, can you tell us what is not working for you?",
    }, function(response, convo) {
      bot.reply(incoming, {
          text: `Thanks for that!`,
      });
      convo.stop()
      unhappyProbe2(bot, incoming)
    });
  });
}

function unhappyProbe2(bot, incoming){
  bot.startConversation(incoming, function(err, convo) {
    convo.ask({
      text: "Is there one think that ACME can change to make you happier?",
    }, function(response, convo) {
      bot.reply(incoming, {
          text: `Thanks!`,
      });
      convo.stop()
      activity(bot, incoming)
    });
  });
}
function happyProbe(bot, incoming){
  bot.reply(incoming, {
      text: `That’s great that you are happy with ACME!`,
  });
  bot.startConversation(incoming, function(err, convo) {
    convo.ask({
      text: "We like a pat on the back, can you tell us why?",
    }, function(response, convo) {
      bot.reply(incoming, {
          text: `Thanks for that!`,
      });
      convo.stop()
      activity(bot, incoming)
    });
  });
}
function semihappyProbe(bot, incoming){
  bot.startConversation(incoming, function(err, convo) {
    convo.ask({
      text: "Is there one thing that ACME can change to make you happier?",
    }, function(response, convo) {
      bot.reply(incoming, {
          text: `Thanks!`,
      });
      convo.stop()
      activity(bot, incoming)
    });
  });
}
function activity(bot, incoming){
  bot.reply(incoming, {"attachment":{
    "type":"template",
    "payload":{
      "template_type":"button",
      "text":"Finally, Which of the following interactions have you had with ACME in the last week?",
      "buttons":[
        {
          "type":"web_url",
          "url":"https://ancient-beach-76921.herokuapp.com/activities/"+ incoming.user,
          "title":"What I did last week",
          "messenger_extensions": true,
          "webview_height_ratio": "tall"
        }
      ]
    }
  }});
}

}
function shuffle(array) {
    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}
