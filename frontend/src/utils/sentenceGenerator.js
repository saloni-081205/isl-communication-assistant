
const normalizeSentence = (value) =>
  String(value ?? "")
    .toLowerCase()
    .replace(/[.!?,;:]+/g, "")
    .replace(/\s+/g, " ")
    .trim();


const exactTranslations = {
  "break": {
    hindi: "आराम",
    gujarati: "આરામ"
  },
  "i need a break.": {
    hindi: "मुझे आराम चाहिए।",
    gujarati: "મારે આરામ કરવો છે."
  },
  "please take a break.": {
    hindi: "कृपया आराम करें।",
    gujarati: "કૃપા કરીને આરામ કરો."
  },
  "let us take a short break.": {
    hindi: "चलो थोड़ा आराम करते हैं।",
    gujarati: "ચાલો થોડો આરામ કરીએ."
  },

  "budget": {
    hindi: "बजट",
    gujarati: "બજેટ"
  },
  "what is our budget?": {
    hindi: "हमारा बजट कितना है?",
    gujarati: "આપણું બજેટ કેટલું છે?"
  },
  "my budget is low.": {
    hindi: "मेरा बजट कम है।",
    gujarati: "મારું બજેટ ઓછું છે."
  },
  "we need to save money.": {
    hindi: "हमें पैसे बचाने चाहिए।",
    gujarati: "આપણે પૈસા બચાવવા જોઈએ."
  },

  "busy": {
    hindi: "व्यस्त",
    gujarati: "વ્યસ્ત"
  },
  "i am busy.": {
    hindi: "मैं व्यस्त हूँ।",
    gujarati: "હું વ્યસ્ત છું."
  },
  "are you busy now?": {
    hindi: "क्या आप अभी व्यस्त हैं?",
    gujarati: "શું તમે અત્યારે વ્યસ્ત છો?"
  },
  "i am busy with work.": {
    hindi: "मैं काम में व्यस्त हूँ।",
    gujarati: "હું કામમાં વ્યસ્ત છું."
  },

  "clean": {
    hindi: "साफ",
    gujarati: "સ્વચ્છ"
  },
  "please clean the room.": {
    hindi: "कृपया कमरा साफ करें।",
    gujarati: "કૃપા કરીને રૂમ સાફ કરો."
  },
  "i want to clean my house.": {
    hindi: "मैं अपना घर साफ करना चाहता हूँ।",
    gujarati: "હું મારું ઘર સાફ કરવા માગું છું."
  },
  "keep your hands clean.": {
    hindi: "अपने हाथ साफ रखें।",
    gujarati: "તમારા હાથ સ્વચ્છ રાખો."
  },

  "close": {
    hindi: "बंद करना",
    gujarati: "બંધ કરવું"
  },
  "please close the door.": {
    hindi: "कृपया दरवाज़ा बंद करें।",
    gujarati: "કૃપા કરીને દરવાજો બંધ કરો."
  },
  "close the window, please.": {
    hindi: "कृपया खिड़की बंद करें।",
    gujarati: "કૃપા કરીને બારી બંધ કરો."
  },
  "the shop is closed.": {
    hindi: "दुकान बंद है।",
    gujarati: "દુકાન બંધ છે."
  },

  "come": {
    hindi: "आना",
    gujarati: "આવવું"
  },
  "please come here.": {
    hindi: "कृपया यहाँ आइए।",
    gujarati: "કૃપા કરીને અહીં આવો."
  },
  "come with me.": {
    hindi: "मेरे साथ आइए।",
    gujarati: "મારી સાથે આવો."
  },
  "come home early.": {
    hindi: "जल्दी घर आइए।",
    gujarati: "જલ્દી ઘરે આવો."
  },

  "cook": {
    hindi: "खाना बनाना",
    gujarati: "રસોઈ બનાવવી"
  },
  "i can cook food.": {
    hindi: "मैं खाना बना सकता हूँ।",
    gujarati: "હું જમવાનું બનાવી શકું છું."
  },
  "what are you cooking?": {
    hindi: "आप क्या बना रहे हैं?",
    gujarati: "તમે શું બનાવી રહ્યા છો?"
  },
  "please cook dinner.": {
    hindi: "कृपया रात का खाना बनाइए।",
    gujarati: "કૃપા કરીને રાત્રિનું જમવાનું બનાવો."
  },

  "cry": {
    hindi: "रोना",
    gujarati: "રડવું"
  },
  "the baby is crying.": {
    hindi: "बच्चा रो रहा है।",
    gujarati: "બાળક રડી રહ્યું છે."
  },
  "please do not cry.": {
    hindi: "कृपया मत रोइए।",
    gujarati: "કૃપા કરીને રડશો નહીં."
  },
  "why are you crying?": {
    hindi: "आप क्यों रो रहे हैं?",
    gujarati: "તમે કેમ રડી રહ્યા છો?"
  },

  "drink": {
    hindi: "पीना",
    gujarati: "પીવું"
  },
  "i want to drink water.": {
    hindi: "मुझे पानी पीना है।",
    gujarati: "મારે પાણી પીવું છે."
  },
  "please drink some milk.": {
    hindi: "कृपया थोड़ा दूध पीजिए।",
    gujarati: "કૃપા કરીને થોડું દૂધ પીઓ."
  },
  "do you want a drink?": {
    hindi: "क्या आप कुछ पीना चाहते हैं?",
    gujarati: "શું તમે કંઈક પીવા માંગો છો?"
  },

  "exam": {
    hindi: "परीक्षा",
    gujarati: "પરીક્ષા"
  },
  "my exam is tomorrow.": {
    hindi: "मेरी परीक्षा कल है।",
    gujarati: "મારી પરીક્ષા આવતીકાલે છે."
  },
  "i am preparing for my exam.": {
    hindi: "मैं अपनी परीक्षा की तैयारी कर रहा हूँ।",
    gujarati: "હું મારી પરીક્ષાની તૈયારી કરી રહ્યો છું."
  },
  "the exam was easy.": {
    hindi: "परीक्षा आसान थी।",
    gujarati: "પરીક્ષા સરળ હતી."
  },

  "fedup": {
    hindi: "परेशान",
    gujarati: "કંટાળી ગયેલું"
  },
  "i am fed up with this.": {
    hindi: "मैं इससे परेशान हो गया हूँ।",
    gujarati: "હું આનાથી કંટાળી ગયો છું."
  },
  "i am fed up with waiting.": {
    hindi: "मैं इंतज़ार करते-करते परेशान हो गया हूँ।",
    gujarati: "હું રાહ જોઈને કંટાળી ગયો છું."
  },
  "i am fed up with this problem.": {
    hindi: "मैं इस समस्या से परेशान हो गया हूँ।",
    gujarati: "હું આ સમસ્યાથી કંટાળી ગયો છું."
  },

  "fever": {
    hindi: "बुखार",
    gujarati: "તાવ"
  },
  "i have a fever.": {
    hindi: "मुझे बुखार है।",
    gujarati: "મને તાવ છે."
  },
  "i need some medicine.": {
    hindi: "मुझे दवा चाहिए।",
    gujarati: "મારે દવા જોઈએ છે."
  },
  "please take me to a doctor.": {
    hindi: "कृपया मुझे डॉक्टर के पास ले चलिए।",
    gujarati: "કૃપા કરીને મને ડૉક્ટર પાસે લઈ જાઓ."
  },

  "give": {
    hindi: "देना",
    gujarati: "આપવું"
  },
  "please give me water.": {
    hindi: "कृपया मुझे पानी दीजिए।",
    gujarati: "કૃપા કરીને મને પાણી આપો."
  },
  "give me a pen, please.": {
    hindi: "कृपया मुझे एक पेन दीजिए।",
    gujarati: "કૃપા કરીને મને એક પેન આપો."
  },
  "can you give me some help?": {
    hindi: "क्या आप मेरी मदद कर सकते हैं?",
    gujarati: "શું તમે મારી મદદ કરી શકો છો?"
  },

  "good afternoon": {
    hindi: "शुभ दोपहर",
    gujarati: "શુભ બપોર"
  },
  "good afternoon, everyone.": {
    hindi: "आप सभी को शुभ दोपहर।",
    gujarati: "તમામને શુભ બપોર."
  },
  "good afternoon, how are you?": {
    hindi: "शुभ दोपहर, आप कैसे हैं?",
    gujarati: "શુભ બપોર, તમે કેમ છો?"
  },
  "good afternoon, sir.": {
    hindi: "शुभ दोपहर, सर।",
    gujarati: "શુભ બપોર, સાહેબ."
  },

  "good morning": {
    hindi: "सुप्रभात",
    gujarati: "સુપ્રભાત"
  },
  "good morning, everyone.": {
    hindi: "आप सभी को सुप्रभात।",
    gujarati: "તમામને સુપ્રભાત."
  },
  "good morning, how are you?": {
    hindi: "सुप्रभात, आप कैसे हैं?",
    gujarati: "સુપ્રભાત, તમે કેમ છો?"
  },
  "good morning, teacher.": {
    hindi: "सुप्रभात, शिक्षक।",
    gujarati: "સુપ્રભાત, શિક્ષક."
  },

  "hello": {
    hindi: "नमस्ते",
    gujarati: "નમસ્તે"
  },
  "hello, how are you?": {
    hindi: "नमस्ते, आप कैसे हैं?",
    gujarati: "નમસ્તે, તમે કેમ છો?"
  },
  "hello, nice to meet you.": {
    hindi: "नमस्ते, आपसे मिलकर अच्छा लगा।",
    gujarati: "નમસ્તે, તમને મળીને આનંદ થયો."
  },
  "hello, can you help me?": {
    hindi: "नमस्ते, क्या आप मेरी मदद कर सकते हैं?",
    gujarati: "નમસ્તે, શું તમે મારી મદદ કરી શકો છો?"
  },

  "hug": {
    hindi: "गले लगाना",
    gujarati: "ગળે લગાવવું"
  },
  "can i give you a hug?": {
    hindi: "क्या मैं आपको गले लगा सकता हूँ?",
    gujarati: "શું હું તમને ગળે લગાવી શકું?"
  },
  "i need a hug.": {
    hindi: "मुझे गले लगने की ज़रूरत है।",
    gujarati: "મારે કોઈના ગળે લાગવું છે."
  },
  "please give me a hug.": {
    hindi: "कृपया मुझे गले लगाइए।",
    gujarati: "કૃપા કરીને મને ગળે લગાવો."
  },

  "injury": {
    hindi: "चोट",
    gujarati: "ઈજા"
  },
  "i have an injury.": {
    hindi: "मुझे चोट लगी है।",
    gujarati: "મને ઈજા થઈ છે."
  },
  "my leg is injured.": {
    hindi: "मेरे पैर में चोट लगी है।",
    gujarati: "મારા પગમાં ઈજા થઈ છે."
  },
  "please help me with my injury.": {
    hindi: "कृपया मेरी चोट में मदद करें।",
    gujarati: "કૃપા કરીને મારી ઈજામાં મદદ કરો."
  },

  "interview": {
    hindi: "साक्षात्कार",
    gujarati: "ઇન્ટરવ્યૂ"
  },
  "my interview is today.": {
    hindi: "मेरा इंटरव्यू आज है।",
    gujarati: "મારો ઇન્ટરવ્યૂ આજે છે."
  },
  "i am preparing for an interview.": {
    hindi: "मैं इंटरव्यू की तैयारी कर रहा हूँ।",
    gujarati: "હું ઇન્ટરવ્યૂની તૈયારી કરી રહ્યો છું."
  },
  "i have an interview tomorrow.": {
    hindi: "मेरा इंटरव्यू कल है।",
    gujarati: "મારો ઇન્ટરવ્યૂ આવતીકાલે છે."
  },

  "jump": {
    hindi: "कूदना",
    gujarati: "કૂદવું"
  },
  "please jump up.": {
    hindi: "कृपया ऊपर कूदिए।",
    gujarati: "કૃપા કરીને ઉપર કૂદો."
  },
  "the boy can jump high.": {
    hindi: "लड़का ऊँची छलांग लगा सकता है।",
    gujarati: "છોકરો ઊંચો કૂદી શકે છે."
  },
  "can you jump over this?": {
    hindi: "क्या आप इसके ऊपर से कूद सकते हैं?",
    gujarati: "શું તમે તેની ઉપરથી કૂદી શકો છો?"
  },

  "man": {
    hindi: "आदमी",
    gujarati: "માણસ"
  },
  "that man is my father.": {
    hindi: "वह आदमी मेरे पिता हैं।",
    gujarati: "તે માણસ મારા પિતા છે."
  },
  "the man is waiting outside.": {
    hindi: "वह आदमी बाहर इंतज़ार कर रहा है।",
    gujarati: "તે માણસ બહાર રાહ જોઈ રહ્યો છે."
  },
  "who is that man?": {
    hindi: "वह आदमी कौन है?",
    gujarati: "તે માણસ કોણ છે?"
  },

  "tea": {
    hindi: "चाय",
    gujarati: "ચા"
  },
  "i want some tea.": {
    hindi: "मुझे चाय चाहिए।",
    gujarati: "મારે ચા જોઈએ છે."
  },
  "would you like some tea?": {
    hindi: "क्या आप चाय लेना चाहेंगे?",
    gujarati: "શું તમે ચા પીશો?"
  },
  "please make me a cup of tea.": {
    hindi: "कृपया मेरे लिए एक कप चाय बनाइए।",
    gujarati: "કૃપા કરીને મારા માટે એક કપ ચા બનાવો."
  },

  "temple": {
    hindi: "मंदिर",
    gujarati: "મંદિર"
  },
  "i want to visit the temple.": {
    hindi: "मैं मंदिर जाना चाहता हूँ।",
    gujarati: "હું મંદિરે જવા માગું છું."
  },
  "the temple is nearby.": {
    hindi: "मंदिर पास में है।",
    gujarati: "મંદિર નજીકમાં છે."
  },
  "let us go to the temple.": {
    hindi: "चलो मंदिर चलते हैं।",
    gujarati: "ચાલો મંદિરે જઈએ."
  },

  "thank you": {
    hindi: "धन्यवाद",
    gujarati: "આભાર"
  },
  "thank you for your help.": {
    hindi: "आपकी मदद के लिए धन्यवाद।",
    gujarati: "તમારી મદદ માટે આભાર."
  },
  "thank you very much.": {
    hindi: "बहुत-बहुत धन्यवाद।",
    gujarati: "ખૂબ ખૂબ આભાર."
  },
  "thank you for coming.": {
    hindi: "आने के लिए धन्यवाद।",
    gujarati: "આવવા બદલ આભાર."
  },

  "what is your name": {
    hindi: "आपका नाम क्या है?",
    gujarati: "તમારું નામ શું છે?"
  },
  "what is your name?": {
    hindi: "आपका नाम क्या है?",
    gujarati: "તમારું નામ શું છે?"
  },
  "may i know your name?": {
    hindi: "क्या मैं आपका नाम जान सकता हूँ?",
    gujarati: "શું હું તમારું નામ જાણી શકું?"
  },
  "please tell me your name.": {
    hindi: "कृपया अपना नाम बताइए।",
    gujarati: "કૃપા કરીને તમારું નામ જણાવો."
  },

  "wife": {
    hindi: "पत्नी",
    gujarati: "પત્ની"
  },
  "she is my wife.": {
    hindi: "वह मेरी पत्नी हैं।",
    gujarati: "તે મારી પત્ની છે."
  },
  "my wife is at home.": {
    hindi: "मेरी पत्नी घर पर हैं।",
    gujarati: "મારી પત્ની ઘરે છે."
  },
  "my wife is very kind.": {
    hindi: "मेरी पत्नी बहुत दयालु हैं।",
    gujarati: "મારી પત્ની ખૂબ દયાળુ છે."
  },

  "wrong": {
    hindi: "गलत",
    gujarati: "ખોટું"
  },
  "this answer is wrong.": {
    hindi: "यह उत्तर गलत है।",
    gujarati: "આ જવાબ ખોટો છે."
  },
  "i made a wrong choice.": {
    hindi: "मैंने गलत चुनाव किया।",
    gujarati: "મેં ખોટી પસંદગી કરી."
  },
  "please tell me what is wrong.": {
    hindi: "कृपया बताइए कि क्या गलत है।",
    gujarati: "કૃપા કરીને શું ખોટું છે તે જણાવો."
  },

  "writer": {
    hindi: "लेखक",
    gujarati: "લેખક"
  },
  "he is a good writer.": {
    hindi: "वह एक अच्छे लेखक हैं।",
    gujarati: "તે સારા લેખક છે."
  },
  "i want to become a writer.": {
    hindi: "मैं लेखक बनना चाहता हूँ।",
    gujarati: "હું લેખક બનવા માગું છું."
  },
  "the writer wrote a new book.": {
    hindi: "लेखक ने एक नई किताब लिखी।",
    gujarati: "લેખકે એક નવું પુસ્તક લખ્યું."
  },

  "uncle": {
    hindi: "चाचा",
    gujarati: "કાકા"
  },
  "my uncle is coming today.": {
    hindi: "मेरे चाचा आज आ रहे हैं।",
    gujarati: "મારા કાકા આજે આવી રહ્યા છે."
  },
  "my uncle lives nearby.": {
    hindi: "मेरे चाचा पास में रहते हैं।",
    gujarati: "મારા કાકા નજીકમાં રહે છે."
  },
  "i want to visit my uncle.": {
    hindi: "मैं अपने चाचा से मिलने जाना चाहता हूँ।",
    gujarati: "હું મારા કાકાને મળવા જવા માગું છું."
  },

  "vegetables": {
    hindi: "सब्ज़ियाँ",
    gujarati: "શાકભાજી"
  },
  "i want to buy vegetables.": {
    hindi: "मुझे सब्ज़ियाँ खरीदनी हैं।",
    gujarati: "મારે શાકભાજી ખરીદવી છે."
  },
  "please wash the vegetables.": {
    hindi: "कृपया सब्ज़ियाँ धो दीजिए।",
    gujarati: "કૃપા કરીને શાકભાજી ધોઈ આપો."
  },
  "i eat vegetables every day.": {
    hindi: "मैं रोज़ सब्ज़ियाँ खाता हूँ।",
    gujarati: "હું દરરોજ શાકભાજી ખાઉં છું."
  }
};


const wordTranslations = {
  hello: { hindi: "नमस्ते", gujarati: "નમસ્તે" },
  hi: { hindi: "नमस्ते", gujarati: "નમસ્તે" },
  good: { hindi: "अच्छा", gujarati: "સારું" },
  morning: { hindi: "सुबह", gujarati: "સવાર" },
  afternoon: { hindi: "दोपहर", gujarati: "બપોર" },
  night: { hindi: "रात", gujarati: "રાત" },
  goodbye: { hindi: "अलविदा", gujarati: "આવજો" },
  thank: { hindi: "धन्यवाद", gujarati: "આભાર" },
  you: { hindi: "आप", gujarati: "તમે" },
  please: { hindi: "कृपया", gujarati: "કૃપા કરીને" },
  sorry: { hindi: "माफ़ कीजिए", gujarati: "માફ કરશો" },
  help: { hindi: "मदद", gujarati: "મદદ" },
  water: { hindi: "पानी", gujarati: "પાણી" },
  food: { hindi: "खाना", gujarati: "ભોજન" },
  hungry: { hindi: "भूखा", gujarati: "ભૂખ્યું" },
  thirsty: { hindi: "प्यासा", gujarati: "તરસ્યું" },
  school: { hindi: "स्कूल", gujarati: "શાળા" },
  teacher: { hindi: "शिक्षक", gujarati: "શિક્ષક" },
  doctor: { hindi: "डॉक्टर", gujarati: "ડૉક્ટર" },
  hospital: { hindi: "अस्पताल", gujarati: "હોસ્પિટલ" },
  bathroom: { hindi: "बाथरूम", gujarati: "બાથરૂમ" },
  yes: { hindi: "हाँ", gujarati: "હા" },
  no: { hindi: "नहीं", gujarati: "ના" },
  name: { hindi: "नाम", gujarati: "નામ" },
  my: { hindi: "मेरा", gujarati: "મારું" },
  love: { hindi: "प्यार", gujarati: "પ્રેમ" },
  family: { hindi: "परिवार", gujarati: "પરિવાર" },
  friend: { hindi: "दोस्त", gujarati: "મિત્ર" },
  home: { hindi: "घर", gujarati: "ઘર" },
  where: { hindi: "कहाँ", gujarati: "ક્યાં" },
  what: { hindi: "क्या", gujarati: "શું" },
  why: { hindi: "क्यों", gujarati: "શા માટે" },
  when: { hindi: "कब", gujarati: "ક્યારે" },
  how: { hindi: "कैसे", gujarati: "કેવી રીતે" },
  are: { hindi: "हैं", gujarati: "છો" },
  am: { hindi: "हूँ", gujarati: "છું" },
  is: { hindi: "है", gujarati: "છે" },
  i: { hindi: "मैं", gujarati: "હું" },
  me: { hindi: "मुझे", gujarati: "મને" },
  need: { hindi: "ज़रूरत", gujarati: "જરૂરિયાત" },
  want: { hindi: "चाहता", gujarati: "જોઈએ" },
  water: { hindi: "पानी", gujarati: "પાણી" },
  today: { hindi: "आज", gujarati: "આજે" },
  tomorrow: { hindi: "कल", gujarati: "આવતીકાલે" },
  eat: { hindi: "खाना", gujarati: "ખાવું" },
  speak: { hindi: "बात करना", gujarati: "વાત કરવી" },
  talk: { hindi: "बात करना", gujarati: "વાત કરવી" },
  and: { hindi: "और", gujarati: "અને" },
  the: { hindi: "", gujarati: "" },
  a: { hindi: "", gujarati: "" },
  an: { hindi: "", gujarati: "" },
  is: { hindi: "है", gujarati: "છે" }
};


export const generateEnglishSentence = (sequence = []) => {
  const items = Array.isArray(sequence) ? sequence : [sequence];

  const text = items.every(
    (item) =>
      String(item).length <= 1 ||
      String(item).trim() === ""
  )
    ? items.join("")
    : items.join(" ");

  const normalized = text
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

  if (!normalized) return "";

  const key = normalizeSentence(normalized);

  // Return the recognized phrase if it has an exact translation.
  if (exactTranslations[key]) {
    return normalized.charAt(0).toUpperCase() +
      normalized.slice(1).replace(/[.!?]*$/, "") + ".";
  }

  // Do not generate generic sentences such as "I want to say..."
  // Return the recognized text instead.
  return normalized.charAt(0).toUpperCase() +
    normalized.slice(1).replace(/[.!?]*$/, "");
};



export const translateSentence = (english = "") => {
  const source = String(english ?? "").trim();

  if (!source) {
    return {
      english: "",
      hindi: "",
      gujarati: "",
      quality: {
        hindi: "exact",
        gujarati: "exact"
      }
    };
  }

  const key = normalizeSentence(source);

  // Normalize dictionary keys too, so punctuation differences
  // do not prevent an exact translation match.
  const exact = Object.entries(exactTranslations).find(
    ([translationKey]) =>
      normalizeSentence(translationKey) === key
  )?.[1];

  // Use your predefined complete translations whenever available.
  if (exact) {
    return {
      english: source,
      hindi: exact.hindi,
      gujarati: exact.gujarati,
      quality: {
        hindi: "exact",
        gujarati: "exact"
      }
    };
  }

  // Word-level fallback only when no complete translation exists.
  const words = key.split(" ");

  const hindi = words
    .map((word) => wordTranslations[word]?.hindi ?? word)
    .filter(Boolean)
    .join(" ");

  const gujarati = words
    .map((word) => wordTranslations[word]?.gujarati ?? word)
    .filter(Boolean)
    .join(" ");

  return {
    english: source,
    hindi: hindi || "इस वाक्य का अनुवाद उपलब्ध नहीं है।",
    gujarati: gujarati || "આ વાક્યનો અનુવાદ ઉપલબ્ધ નથી.",
    quality: {
      hindi: "approximate",
      gujarati: "approximate"
    }
  };
};

