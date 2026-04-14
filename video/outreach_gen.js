const fs = require('fs');

const drafts = [
  {
    contact_id: "17dc795e-c53a-411c-a431-829042ce2237",
    contact_name: "Burlington Family Dentists",
    company: "Burlington Family Dentists",
    rating: "5/5 (171 reviews)",
    messages: {
      connection: "Hi there \u2014 saw Burlington Family Dentists has a perfect 5-star rating with 171 reviews. That kind of reputation takes serious work. I help dental practices in Burlington handle the admin side with AI \u2014 things like after-hours calls and booking. Worth connecting?",
      followup_1: "Thanks for connecting! Quick thought \u2014 are missed calls or after-hours inquiries an issue at Burlington Family Dentists? We help dental practices in Ontario deploy a 24/7 AI receptionist that answers every call, books appointments directly into your calendar, and never puts anyone on hold. Happy to send a 2-minute demo if useful.",
      followup_2: "No worries if the timing isn't right. Last note \u2014 we offer a free 15-minute AI Readiness Audit specifically for dental practices. It maps out where you're losing time on admin tasks and what could be automated. Want me to send the link?",
      email_subject: "171 five-star reviews \u2014 but what about the calls you're missing?",
      email_body: "Hi,\n\nBurlington Family Dentists clearly has a stellar reputation \u2014 171 reviews at a perfect 5 stars is no small feat.\n\nI work with dental practices in Burlington that are losing new-patient calls to voicemail after hours. We deploy a 24/7 AI receptionist that answers every call, books appointments, and routes urgent cases \u2014 so your team focuses on patients, not phones.\n\nWould a free 15-minute audit of where AI could save your practice the most time be useful? No pitch, just a personalized list.\n\nVince\nClarityWorks Studio"
    }
  },
  {
    contact_id: "3c25915e-eada-4a31-918d-2faeeec7e4b4",
    contact_name: "Aldershot Village Dental",
    company: "Aldershot Village Dental",
    rating: "4.9/5 (241 reviews)",
    messages: {
      connection: "Hi \u2014 Aldershot Village Dental caught my eye, 241 reviews at 4.9 stars in Burlington is impressive. I work with dental clinics on AI tools that handle booking and after-hours calls automatically. Thought it'd be worth connecting.",
      followup_1: "Thanks for connecting! With 241 reviews, Aldershot Village Dental is clearly busy. Are you finding that calls slip through during peak hours or evenings? We've set up AI receptionists for practices like yours \u2014 they answer 24/7, book directly into your system, and handle FAQs. Happy to share a quick case study if useful.",
      followup_2: "Totally understand if now isn't the right time. We just released a free AI Readiness Audit for dental offices \u2014 15 minutes, gives you a concrete list of tasks you could automate this quarter. Want me to send it over?",
      email_subject: "241 reviews and growing \u2014 is your phone keeping up?",
      email_body: "Hi,\n\n241 reviews at 4.9 stars tells me Aldershot Village Dental is doing something right. But with that kind of volume, I'd bet calls are getting missed \u2014 especially after hours.\n\nWe help dental practices in Burlington deploy a 24/7 AI receptionist that picks up every call, books appointments, and routes emergencies. One practice recovered 12 new patients per month just from after-hours calls that used to go to voicemail.\n\nWorth a 15-minute chat to see if it fits? No commitment.\n\nVince\nClarityWorks Studio"
    }
  },
  {
    contact_id: "abcc489c-0a84-4798-a6ea-0d777a4a4745",
    contact_name: "Burlington Dentist at Power Centre",
    company: "Burlington Dentist at Power Centre on Brant Street",
    rating: "5/5 (91 reviews)",
    messages: {
      connection: "Hi \u2014 noticed Burlington Dentist on Brant has a perfect 5-star rating. That level of patient satisfaction says a lot. I help dental offices in Burlington use AI to handle calls and scheduling automatically. Would love to connect.",
      followup_1: "Thanks for connecting! Here's something we keep hearing from dental practices on busy streets like Brant \u2014 new patients call once, get voicemail, and book somewhere else. We built a 24/7 AI receptionist that makes sure that never happens. It answers, books, and sends confirmations. Want me to send a 2-minute walkthrough?",
      followup_2: "No pressure at all. One last thing \u2014 we have a free AI Readiness Audit designed for dental offices. It takes 15 minutes and shows exactly where AI could save your team time each week. Happy to share the link if you're curious.",
      email_subject: "Perfect 5-star rating \u2014 what if you never missed a call?",
      email_body: "Hi,\n\nBurlington Dentist on Brant Street \u2014 perfect 5 stars. Your patients love you.\n\nBut here's the thing most practices don't track: how many new patients called, got voicemail, and booked elsewhere. We deploy a 24/7 AI receptionist for dental offices that answers every call, books appointments, and sends confirmations \u2014 even at midnight.\n\nWould a free 15-minute audit of your call flow be helpful? I'll show you exactly where leads are slipping through.\n\nVince\nClarityWorks Studio"
    }
  },
  {
    contact_id: "30fd37cc-3b2d-44ff-823b-8cfa03f61a82",
    contact_name: "Orchard Family Dentistry",
    company: "Orchard Family Dentistry Burlington",
    rating: "4.9/5 (240 reviews)",
    messages: {
      connection: "Hi \u2014 Orchard Family Dentistry's 240 reviews at 4.9 stars in Burlington is really strong. I help dental practices like yours use AI to manage calls, booking, and patient intake automatically. Thought we should connect.",
      followup_1: "Thanks for connecting! A question for you \u2014 does Orchard Family Dentistry have someone dedicated to answering phones all day? Most practices we work with don't, and that's where an AI receptionist changes everything. It picks up 24/7, books into your calendar, handles rescheduling, and answers common questions. Could send a quick demo if helpful.",
      followup_2: "Totally fine if it's not a priority right now. We have a free 15-minute AI Readiness Audit built for dental practices \u2014 maps out your biggest time-wasters and what could be automated. Want the link?",
      email_subject: "240 reviews \u2014 but how many calls went to voicemail?",
      email_body: "Hi,\n\nOrchard Family Dentistry has 240 reviews at 4.9 stars \u2014 clearly a practice patients trust.\n\nHere's what we've found working with dental offices in Ontario: for every 10 calls, 3-4 go unanswered during busy periods. Each one is a potential new patient lost. We deploy an AI receptionist that answers 100% of calls, books appointments, and never puts anyone on hold.\n\nWant a free 15-minute audit? I'll map out exactly where AI could save your team time this quarter.\n\nVince\nClarityWorks Studio"
    }
  },
  {
    contact_id: "778c837a-2bdd-405b-a2fe-b008031475df",
    contact_name: "Burlington Family Dental Centre",
    company: "Burlington Family Dental Centre",
    rating: "4.8/5 (208 reviews)",
    messages: {
      connection: "Hi \u2014 Burlington Family Dental Centre's 208 reviews and 4.8 rating stood out. I work with dental practices in the area on AI tools that handle after-hours calls and online booking automatically. Worth connecting?",
      followup_1: "Thanks for connecting! With 208 reviews, Burlington Family Dental Centre is clearly growing fast. That usually means the front desk is overwhelmed. We deploy AI receptionists for practices like yours \u2014 picks up every call 24/7, books appointments, handles rescheduling, and answers patient FAQs. Happy to share how it works in a 2-minute video.",
      followup_2: "No worries if it's not the right time. Quick offer \u2014 we have a free 15-minute AI Readiness Audit for dental offices. It shows you exactly which admin tasks are eating the most hours and what AI could handle. Want me to send it?",
      email_subject: "Burlington Family Dental Centre \u2014 what if every call got answered?",
      email_body: "Hi,\n\nBurlington Family Dental Centre \u2014 208 reviews, 4.8 stars. That's a practice patients recommend.\n\nBut growth brings a problem: more calls than your front desk can handle. We help dental practices deploy a 24/7 AI receptionist that answers every call, books appointments, and never lets a new patient slip away to a competitor.\n\nI'd love to offer a free 15-minute audit \u2014 I'll personally map out where AI could save your team the most time.\n\nVince\nClarityWorks Studio"
    }
  }
];

drafts.forEach((d, i) => {
  console.log('\n' + '='.repeat(70));
  console.log('CONTACT ' + (i+1) + ': ' + d.company + ' (' + d.rating + ')');
  console.log('='.repeat(70));
  console.log('\nCONNECTION REQUEST (' + d.messages.connection.length + ' chars):');
  console.log(d.messages.connection);
  console.log('\nFOLLOW-UP #1:');
  console.log(d.messages.followup_1);
  console.log('\nFOLLOW-UP #2:');
  console.log(d.messages.followup_2);
  console.log('\nEMAIL Subject: ' + d.messages.email_subject);
  console.log(d.messages.email_body);
});

fs.writeFileSync(process.env.TEMP + '/outreach_drafts.json', JSON.stringify({drafts}, null, 2));
console.log('\n\nAll 5 drafts saved to %TEMP%/outreach_drafts.json');
console.log('Total: ' + drafts.length + ' contacts x 4 messages = ' + (drafts.length * 4) + ' personalized messages');
