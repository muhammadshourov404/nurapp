'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import BottomNav from '../../components/BottomNav'
import {
  ChevronLeftIcon, SearchIcon, HeartIcon,
  ChevronDownIcon, ChevronUpIcon, CopyIcon,
  CheckIcon, ArrowRightIcon
} from '../../components/Icons'

const DUA_CATEGORIES = [
  {
    id: 'morning_evening', icon: '🌅', color: '#f59e0b',
    nameBn: 'সকাল-সন্ধ্যার আমল', nameEn: 'Morning & Evening',
    duas: [
      { titleBn: 'সকালের দোয়া', titleEn: 'Morning Dua', arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ', bangla: 'আমরা সকালে উপনীত হলাম এবং সকল রাজত্ব আল্লাহর। সমস্ত প্রশংসা আল্লাহর। আল্লাহ ছাড়া কোনো ইলাহ নেই, তিনি একা, কোনো শরিক নেই। তাঁরই রাজত্ব, তাঁরই প্রশংসা এবং তিনি সব কিছুর উপর সর্বশক্তিমান।', english: 'We have reached the morning and at this very time all sovereignty belongs to Allah. All praise is for Allah. None has the right to be worshipped except Allah, alone, without partner.', reference: 'মুসলিম' },
      { titleBn: 'সন্ধ্যার দোয়া', titleEn: 'Evening Dua', arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيكَ لَهُ', bangla: 'আমরা সন্ধ্যায় উপনীত হলাম এবং সকল রাজত্ব আল্লাহর। সমস্ত প্রশংসা আল্লাহর। আল্লাহ ছাড়া কোনো ইলাহ নেই, তিনি একা, কোনো শরিক নেই।', english: 'We have reached the evening and at this very time all sovereignty belongs to Allah. All praise is for Allah. None has the right to be worshipped except Allah, alone, without partner.', reference: 'মুসলিম' },
      { titleBn: 'আয়াতুল কুরসি', titleEn: 'Ayatul Kursi', arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ', bangla: 'আল্লাহ — তিনি ছাড়া কোনো উপাস্য নেই। তিনি চিরঞ্জীব, সর্বসত্তার ধারক। তাঁকে তন্দ্রা ও নিদ্রা স্পর্শ করে না। আসমান ও যমিনে যা কিছু আছে সব তাঁরই।', english: 'Allah — there is no deity except Him, the Ever-Living, the Sustainer of existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth.', reference: 'সূরা বাকারা: ২৫৫' },
      { titleBn: 'সকালের তাসবিহ', titleEn: 'Morning Tasbih', arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ — ১০০ বার', bangla: 'আল্লাহর পবিত্রতা ঘোষণা করছি তাঁর প্রশংসাসহ — ১০০ বার', english: 'Glory be to Allah and His praise — 100 times', reference: 'মুসলিম' },
      { titleBn: 'সকালের আশ্রয় প্রার্থনা', titleEn: 'Morning Protection', arabic: 'اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ', bangla: 'হে আল্লাহ! তোমার অনুগ্রহে আমরা সকালে উপনীত হই, তোমার অনুগ্রহে সন্ধ্যায় উপনীত হই, তোমার মাধ্যমে আমরা বাঁচি ও মরি এবং তোমার কাছেই পুনরুত্থান।', english: 'O Allah, by Your leave we have reached the morning and by Your leave we have reached the evening, by You we live and by You we die, and unto You is our resurrection.', reference: 'তিরমিযি' },
    ]
  },
  {
    id: 'salah', icon: '🕌', color: '#10b981',
    nameBn: 'নামাজ সংক্রান্ত', nameEn: 'Prayer Related',
    duas: [
      { titleBn: 'নামাজের নিয়ত', titleEn: 'Prayer Intention', arabic: 'نَوَيْتُ أَنْ أُصَلِّيَ لِلَّهِ تَعَالَى', bangla: 'আমি আল্লাহ তায়ালার উদ্দেশ্যে নামাজ আদায়ের নিয়ত করলাম।', english: 'I intend to offer prayer for the sake of Allah the Almighty.', reference: 'ফিকহ' },
      { titleBn: 'তাকবিরে তাহরিমা', titleEn: 'Opening Takbir', arabic: 'اللَّهُ أَكْبَرُ', bangla: 'আল্লাহ সর্বমহান।', english: 'Allah is the Greatest.', reference: 'বুখারি' },
      { titleBn: 'সানা (দোয়ায়ে ইস্তিফতাহ)', titleEn: 'Opening Supplication', arabic: 'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ وَتَبَارَكَ اسْمُكَ وَتَعَالَى جَدُّكَ وَلَا إِلَهَ غَيْرُكَ', bangla: 'হে আল্লাহ! তুমি পবিত্র, তোমার প্রশংসা করি। তোমার নাম বরকতময়, তোমার মর্যাদা সর্বোচ্চ এবং তুমি ছাড়া কোনো ইলাহ নেই।', english: 'Glory be to You O Allah, and praise. Blessed is Your name and exalted is Your majesty. There is no god but You.', reference: 'আবু দাউদ' },
      { titleBn: 'রুকুর দোয়া', titleEn: 'Ruku Dua', arabic: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ', bangla: 'আমার মহান রবের পবিত্রতা ঘোষণা করছি।', english: 'Glory be to my Lord, the Most Great.', reference: 'মুসলিম' },
      { titleBn: 'রুকু থেকে উঠার দোয়া', titleEn: 'Rising from Ruku', arabic: 'سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ، رَبَّنَا وَلَكَ الْحَمْدُ', bangla: 'আল্লাহ তার কথা শোনেন যে তাঁর প্রশংসা করে। হে আমাদের রব! তোমারই জন্য সকল প্রশংসা।', english: 'Allah hears whoever praises Him. Our Lord, to You is all praise.', reference: 'বুখারি' },
      { titleBn: 'সিজদার দোয়া', titleEn: 'Sujood Dua', arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَى', bangla: 'আমার সর্বোচ্চ রবের পবিত্রতা ঘোষণা করছি।', english: 'Glory be to my Lord, the Most High.', reference: 'মুসলিম' },
      { titleBn: 'দুই সিজদার মাঝে দোয়া', titleEn: 'Between Two Sujood', arabic: 'رَبِّ اغْفِرْ لِي وَارْحَمْنِي وَاهْدِنِي وَعَافِنِي وَارْزُقْنِي', bangla: 'হে আমার রব! আমাকে ক্ষমা করো, আমার উপর দয়া করো, আমাকে হেদায়েত দাও, আমাকে সুস্থ রাখো এবং আমাকে রিযিক দাও।', english: 'My Lord, forgive me, have mercy on me, guide me, grant me well-being, and grant me provision.', reference: 'তিরমিযি' },
      { titleBn: 'তাশাহহুদ', titleEn: 'Tashahhud', arabic: 'التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ، السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ', bangla: 'সকল সম্মান, নামাজ ও পবিত্র বিষয় আল্লাহর জন্য। হে নবী! আপনার উপর সালাম, আল্লাহর রহমত ও বরকত বর্ষিত হোক।', english: 'All the compliments, prayers and good things are due to Allah. Peace be upon you, O Prophet, and the mercy of Allah and His blessings.', reference: 'বুখারি' },
      { titleBn: 'নামাজ শেষে দোয়া', titleEn: 'After Prayer', arabic: 'اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ', bangla: 'হে আল্লাহ! তুমি শান্তি এবং তোমার কাছ থেকেই শান্তি আসে। তুমি বরকতময়, হে মহিমাময় ও সম্মানিত।', english: 'O Allah, You are Peace and from You comes peace. Blessed are You, O Owner of majesty and honor.', reference: 'মুসলিম' },
    ]
  },
  {
    id: 'darood', icon: '✨', color: '#8b5cf6',
    nameBn: 'দরুদ শরীফ', nameEn: 'Salawat (Darood)',
    duas: [
      { titleBn: 'দরুদে ইব্রাহিম', titleEn: 'Darood Ibrahim', arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ', bangla: 'হে আল্লাহ! মুহাম্মদ (সা) ও তাঁর পরিবারের উপর রহমত বর্ষণ করো যেভাবে ইব্রাহিম ও তাঁর পরিবারের উপর রহমত বর্ষণ করেছো। নিশ্চয়ই তুমি প্রশংসিত ও মহিমান্বিত।', english: 'O Allah, send prayers upon Muhammad and upon the family of Muhammad, as You sent prayers upon Ibrahim and upon the family of Ibrahim. Indeed, You are praiseworthy and glorious.', reference: 'বুখারি ও মুসলিম' },
      { titleBn: 'দরুদে তুনাজ্জিনা', titleEn: 'Darood Tunajjina', arabic: 'اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ صَلَاةً تُنَجِّينَا بِهَا مِنْ جَمِيعِ الْأَهْوَالِ وَالْآفَاتِ', bangla: 'হে আল্লাহ! আমাদের নবী মুহাম্মদ (সা) এর উপর এমন দরুদ পাঠ করো, যা দ্বারা আমরা সকল ভয় ও বিপদ থেকে মুক্তি পাই।', english: 'O Allah, bestow upon our master Muhammad such blessing by which You will save us from all fearful things and calamities.', reference: 'দুরুদ সংকলন' },
      { titleBn: 'দরুদে মাহি', titleEn: 'Darood Mahi', arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ عَبْدِكَ وَرَسُولِكَ النَّبِيِّ الْأُمِّيِّ', bangla: 'হে আল্লাহ! তোমার বান্দা, রাসুল ও নিরক্ষর নবী মুহাম্মদ (সা) এর উপর রহমত বর্ষণ করো।', english: 'O Allah, send blessings upon Muhammad, Your servant and messenger, the unlettered Prophet.', reference: 'মুসলিম' },
      { titleBn: 'সংক্ষিপ্ত দরুদ', titleEn: 'Short Salawat', arabic: 'صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ', bangla: 'আল্লাহ তাঁর উপর রহমত ও শান্তি বর্ষণ করুন।', english: 'May Allah send His peace and blessings upon him.', reference: 'কোরআন' },
      { titleBn: 'জুমার দিনের দরুদ', titleEn: "Friday's Salawat", arabic: 'اللَّهُمَّ صَلِّ وَسَلِّمْ وَبَارِكْ عَلَى نَبِيِّنَا مُحَمَّدٍ', bangla: 'হে আল্লাহ! আমাদের নবী মুহাম্মদ (সা) এর উপর রহমত, শান্তি ও বরকত বর্ষণ করো।', english: 'O Allah, bestow Your mercy, peace and blessings upon our Prophet Muhammad.', reference: 'হাদিস' },
    ]
  },
  {
    id: 'food', icon: '🍽️', color: '#f97316',
    nameBn: 'খাওয়া-দাওয়া', nameEn: 'Food & Drink',
    duas: [
      { titleBn: 'খাওয়ার আগে', titleEn: 'Before Eating', arabic: 'بِسْمِ اللَّهِ وَعَلَى بَرَكَةِ اللَّهِ', bangla: 'আল্লাহর নামে এবং আল্লাহর বরকতের সাথে শুরু করছি।', english: 'In the name of Allah and with the blessings of Allah.', reference: 'আবু দাউদ' },
      { titleBn: 'খাওয়ার মাঝে ভুলে গেলে', titleEn: 'If Forgotten Before', arabic: 'بِسْمِ اللَّهِ أَوَّلَهُ وَآخِرَهُ', bangla: 'আল্লাহর নামে শুরুতে এবং শেষে।', english: 'In the name of Allah at its beginning and end.', reference: 'তিরমিযি' },
      { titleBn: 'খাওয়ার পরে', titleEn: 'After Eating', arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ', bangla: 'সকল প্রশংসা আল্লাহর, যিনি আমাকে এটি খাইয়েছেন এবং আমার কোনো শক্তি ও ক্ষমতা ছাড়াই রিযিক দিয়েছেন।', english: 'All praise is due to Allah who fed me this and provided it for me without any might or power on my part.', reference: 'তিরমিযি' },
      { titleBn: 'পানি পানের দোয়া', titleEn: 'Drinking Water', arabic: 'الْحَمْدُ لِلَّهِ الَّذِي سَقَانَا عَذْبًا فُرَاتًا بِرَحْمَتِهِ وَلَمْ يَجْعَلْهُ مِلْحًا أُجَاجًا بِذُنُوبِنَا', bangla: 'সকল প্রশংসা আল্লাহর, যিনি আমাদের তাঁর রহমতে মিষ্টি পানি পান করিয়েছেন এবং আমাদের পাপের কারণে তা লোনা করেননি।', english: 'Praise be to Allah who gave us sweet and pleasant water to drink by His mercy and did not make it salty because of our sins.', reference: 'হাদিস' },
    ]
  },
  {
    id: 'sleep', icon: '🌙', color: '#6366f1',
    nameBn: 'ঘুমানো-জাগা', nameEn: 'Sleep & Wake',
    duas: [
      { titleBn: 'ঘুমানোর আগে', titleEn: 'Before Sleep', arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا', bangla: 'হে আল্লাহ! তোমার নামেই ঘুমাই এবং জাগি।', english: 'In Your name, O Allah, I die and I live.', reference: 'বুখারি' },
      { titleBn: 'বিছানায় শোয়ার সময়', titleEn: 'Lying Down', arabic: 'اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ', bangla: 'হে আল্লাহ! যেদিন তুমি তোমার বান্দাদের পুনরুত্থিত করবে সেদিন তোমার আযাব থেকে আমাকে রক্ষা করো।', english: 'O Allah, protect me from Your punishment on the day You resurrect Your servants.', reference: 'আবু দাউদ' },
      { titleBn: 'ঘুম থেকে উঠে', titleEn: 'Upon Waking', arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ', bangla: 'সকল প্রশংসা আল্লাহর, যিনি আমাদের মৃত্যুর পর জীবিত করেছেন এবং তাঁর কাছেই পুনরুত্থান।', english: 'All praise is due to Allah who gave us life after death and to Him is the resurrection.', reference: 'বুখারি' },
      { titleBn: 'দুঃস্বপ্ন দেখলে', titleEn: 'After Nightmare', arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ غَضَبِهِ وَعِقَابِهِ وَشَرِّ عِبَادِهِ وَمِنْ هَمَزَاتِ الشَّيَاطِينِ وَأَنْ يَحْضُرُونِ', bangla: 'আমি আল্লাহর পরিপূর্ণ কালিমাসমূহের আশ্রয় নিচ্ছি তাঁর ক্রোধ, শাস্তি, বান্দাদের অনিষ্ট এবং শয়তানের কুমন্ত্রণা থেকে।', english: 'I seek refuge in the perfect words of Allah from His anger, punishment, the evil of His servants, and from the provocations of devils.', reference: 'আবু দাউদ' },
    ]
  },
  {
    id: 'travel', icon: '✈️', color: '#3b82f6',
    nameBn: 'সফর', nameEn: 'Travel',
    duas: [
      { titleBn: 'সফরের দোয়া', titleEn: 'Journey Dua', arabic: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ', bangla: 'পবিত্র সেই সত্তা যিনি এটিকে আমাদের অধীন করে দিয়েছেন। আমরা তো এটি নিয়ন্ত্রণে সক্ষম ছিলাম না। আর নিশ্চয়ই আমরা আমাদের রবের কাছেই ফিরে যাবো।', english: 'Glory be to the One who has subjected this to us, for we were not capable of that. And indeed, to our Lord we will return.', reference: 'তিরমিযি' },
      { titleBn: 'ঘর থেকে বের হওয়ার দোয়া', titleEn: 'Leaving Home', arabic: 'بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ', bangla: 'আল্লাহর নামে, আল্লাহর উপর ভরসা করলাম। আল্লাহর সাহায্য ছাড়া কোনো শক্তি ও ক্ষমতা নেই।', english: 'In the name of Allah, I place my trust in Allah, and there is no might nor power except with Allah.', reference: 'আবু দাউদ' },
      { titleBn: 'ঘরে প্রবেশের দোয়া', titleEn: 'Entering Home', arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ الْمَوْلِجِ وَخَيْرَ الْمَخْرَجِ بِسْمِ اللَّهِ وَلَجْنَا وَبِسْمِ اللَّهِ خَرَجْنَا', bangla: 'হে আল্লাহ! আমি তোমার কাছে প্রবেশের কল্যাণ ও বের হওয়ার কল্যাণ চাই। আল্লাহর নামে প্রবেশ করলাম এবং আল্লাহর নামে বের হলাম।', english: 'O Allah, I ask You for the blessing of entrance and the blessing of exit. In the name of Allah we enter and in the name of Allah we leave.', reference: 'আবু দাউদ' },
      { titleBn: 'মসজিদে প্রবেশের দোয়া', titleEn: 'Entering Mosque', arabic: 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ', bangla: 'হে আল্লাহ! আমার জন্য তোমার রহমতের দরজাসমূহ খুলে দাও।', english: 'O Allah, open for me the gates of Your mercy.', reference: 'মুসলিম' },
      { titleBn: 'মসজিদ থেকে বের হওয়ার দোয়া', titleEn: 'Leaving Mosque', arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ', bangla: 'হে আল্লাহ! আমি তোমার অনুগ্রহ প্রার্থনা করছি।', english: 'O Allah, I ask You from Your bounty.', reference: 'মুসলিম' },
    ]
  },
  {
    id: 'hardship', icon: '🤲', color: '#ef4444',
    nameBn: 'বিপদ ও কষ্টে', nameEn: 'Hardship & Distress',
    duas: [
      { titleBn: 'বিপদে পড়লে', titleEn: 'In Difficulty', arabic: 'إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ، اللَّهُمَّ أْجُرْنِي فِي مُصِيبَتِي وَأَخْلِفْ لِي خَيْرًا مِنْهَا', bangla: 'নিশ্চয়ই আমরা আল্লাহর জন্য এবং তাঁর কাছেই ফিরে যাবো। হে আল্লাহ! এই বিপদে আমাকে পুরস্কার দাও এবং এর চেয়ে উত্তম কিছু দিয়ে প্রতিস্থাপন করো।', english: 'Indeed we belong to Allah, and indeed to Him we will return. O Allah, reward me for my affliction and replace it with something better.', reference: 'মুসলিম' },
      { titleBn: 'দুশ্চিন্তায়', titleEn: 'In Anxiety', arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ وَالْعَجْزِ وَالْكَسَلِ', bangla: 'হে আল্লাহ! আমি তোমার কাছে দুশ্চিন্তা, দুঃখ, অক্ষমতা ও অলসতা থেকে আশ্রয় প্রার্থনা করছি।', english: 'O Allah, I seek refuge in You from anxiety, sorrow, incapacity and laziness.', reference: 'বুখারি' },
      { titleBn: 'ঋণ মুক্তির দোয়া', titleEn: 'For Debt Relief', arabic: 'اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ', bangla: 'হে আল্লাহ! তোমার হালাল রিযিক দিয়ে হারাম থেকে বাঁচাও এবং তোমার অনুগ্রহ দিয়ে তোমা ছাড়া অন্যের মুখাপেক্ষিতা থেকে মুক্ত করো।', english: 'O Allah, suffice me with Your lawful against Your prohibited, and make me independent of all others besides You.', reference: 'তিরমিযি' },
      { titleBn: 'রোগ-ব্যাধিতে', titleEn: 'During Illness', arabic: 'اللَّهُمَّ رَبَّ النَّاسِ أَذْهِبِ الْبَاسَ اشْفِ أَنْتَ الشَّافِي لَا شِفَاءَ إِلَّا شِفَاؤُكَ شِفَاءً لَا يُغَادِرُ سَقَمًا', bangla: 'হে আল্লাহ, মানুষের রব! কষ্ট দূর করো। আরোগ্য দাও, তুমিই আরোগ্যদাতা। তোমার আরোগ্য ছাড়া কোনো আরোগ্য নেই। এমন আরোগ্য দাও যা কোনো রোগ রেখে যায় না।', english: 'O Allah, Lord of the people, remove the suffering. Heal, as You are the Healer. There is no healing except Your healing, a healing that leaves no ailment.', reference: 'বুখারি ও মুসলিম' },
      { titleBn: 'ইসমে আজম দোয়া', titleEn: 'Isme Azam Dua', arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ بِأَنَّكَ أَنْتَ اللَّهُ لَا إِلَهَ إِلَّا أَنْتَ الْأَحَدُ الصَّمَدُ الَّذِي لَمْ يَلِدْ وَلَمْ يُولَدْ وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ', bangla: 'হে আল্লাহ! আমি তোমার কাছে প্রার্থনা করছি, কারণ তুমিই আল্লাহ। তুমি ছাড়া কোনো ইলাহ নেই। তুমি একক, অমুখাপেক্ষী, যিনি জন্ম দেননি এবং জন্মগ্রহণও করেননি এবং তাঁর সমতুল্য কেউ নেই।', english: 'O Allah, I ask You by the fact that You are Allah, there is no god but You, the One, the Eternal Refuge, who neither begets nor was born, nor is there to Him any equivalent.', reference: 'আবু দাউদ ও তিরমিযি' },
    ]
  },
  {
    id: 'forgiveness', icon: '💚', color: '#10b981',
    nameBn: 'ক্ষমা ও তওবা', nameEn: 'Forgiveness & Repentance',
    duas: [
      { titleBn: 'সায়্যিদুল ইস্তিগফার', titleEn: "Sayyid al-Istighfar", arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ', bangla: 'হে আল্লাহ! তুমি আমার রব। তুমি ছাড়া কোনো ইলাহ নেই। তুমি আমাকে সৃষ্টি করেছো এবং আমি তোমার বান্দা। আমি সাধ্যমতো তোমার প্রতিশ্রুতি ও অঙ্গীকারে অটল আছি।', english: 'O Allah, You are my Lord, there is no god but You. You created me and I am Your servant. I am adhering to Your covenant and promise as much as I can.', reference: 'বুখারি' },
      { titleBn: 'ক্ষমা প্রার্থনা', titleEn: 'Seeking Forgiveness', arabic: 'أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ', bangla: 'আমি মহান আল্লাহর কাছে ক্ষমা প্রার্থনা করছি যিনি ছাড়া কোনো ইলাহ নেই, যিনি চিরঞ্জীব, সর্বসত্তার ধারক এবং আমি তাঁর কাছে তওবা করছি।', english: 'I seek forgiveness from Allah the Mighty, whom there is none worthy of worship except Him, the Living, the Eternal, and I repent to Him.', reference: 'তিরমিযি' },
      { titleBn: 'তওবার দোয়া', titleEn: 'Repentance Dua', arabic: 'اللَّهُمَّ اغْفِرْ لِي ذَنْبِي كُلَّهُ دِقَّهُ وَجِلَّهُ وَأَوَّلَهُ وَآخِرَهُ وَعَلَانِيَتَهُ وَسِرَّهُ', bangla: 'হে আল্লাহ! আমার সমস্ত গুনাহ ক্ষমা করো — ছোট ও বড়, প্রথম ও শেষ, প্রকাশ্য ও গোপন।', english: 'O Allah, forgive all my sins — small and great, the first and the last, the open and the secret.', reference: 'মুসলিম' },
    ]
  },
  {
    id: 'quran_duas', icon: '📖', color: '#f59e0b',
    nameBn: 'কোরআনের দোয়া', nameEn: 'Quranic Duas',
    duas: [
      { titleBn: 'সূরা ফাতিহা', titleEn: 'Surah Al-Fatihah', arabic: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ', bangla: 'আমাদেরকে সরল পথ দেখাও — তাদের পথ যাদের উপর তুমি অনুগ্রহ করেছো।', english: 'Guide us to the straight path — the path of those upon whom You have bestowed favor.', reference: 'সূরা ফাতিহা: ৬-৭' },
      { titleBn: 'দোয়ায়ে মাসুরা', titleEn: "Du'a al-Ma'sura", arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ', bangla: 'হে আমাদের রব! আমাদেরকে দুনিয়ায় কল্যাণ দাও এবং আখেরাতে কল্যাণ দাও এবং আমাদেরকে জাহান্নামের আযাব থেকে রক্ষা করো।', english: 'Our Lord, give us in this world good and in the Hereafter good and protect us from the punishment of the Fire.', reference: 'সূরা বাকারা: ২০১' },
      { titleBn: 'হযরত মুসার দোয়া', titleEn: "Moses' Dua", arabic: 'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي وَاحْلُلْ عُقْدَةً مِّن لِّسَانِي يَفْقَهُوا قَوْلِي', bangla: 'হে আমার রব! আমার বুক প্রশস্ত করো, আমার কাজ সহজ করো এবং আমার জিভের জড়তা দূর করো যাতে তারা আমার কথা বুঝতে পারে।', english: 'My Lord, expand for me my breast and ease for me my task and untie the knot from my tongue that they may understand my speech.', reference: 'সূরা ত্বহা: ২৫-২৮' },
      { titleBn: 'হযরত ইউনুসের দোয়া', titleEn: "Yunus' Dua", arabic: 'لَّا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ', bangla: 'তুমি ছাড়া কোনো ইলাহ নেই। তুমি পবিত্র। নিশ্চয়ই আমি জালেমদের অন্তর্ভুক্ত ছিলাম।', english: 'There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers.', reference: 'সূরা আম্বিয়া: ৮৭' },
      { titleBn: 'হযরত আইউবের দোয়া', titleEn: "Ayyub's Dua", arabic: 'أَنِّي مَسَّنِيَ الضُّرُّ وَأَنتَ أَرْحَمُ الرَّاحِمِينَ', bangla: 'আমাকে কষ্ট স্পর্শ করেছে এবং তুমি সর্বশ্রেষ্ঠ দয়ালু।', english: 'Adversity has touched me, and you are the Most Merciful of the merciful.', reference: 'সূরা আম্বিয়া: ৮৩' },
    ]
  },
  {
    id: 'family', icon: '👨‍👩‍👧', color: '#ec4899',
    nameBn: 'পরিবার ও সন্তান', nameEn: 'Family & Children',
    duas: [
      { titleBn: 'নেক সন্তানের জন্য দোয়া', titleEn: 'For Righteous Children', arabic: 'رَبِّ هَبْ لِي مِن لَّدُنكَ ذُرِّيَّةً طَيِّبَةً إِنَّكَ سَمِيعُ الدُّعَاءِ', bangla: 'হে আমার রব! তোমার কাছ থেকে আমাকে পবিত্র সন্তান দাও। নিশ্চয়ই তুমি দোয়া শোনো।', english: 'My Lord, grant me from Yourself a good offspring. Indeed, You are the Hearer of supplication.', reference: 'সূরা আল-ইমরান: ৩৮' },
      { titleBn: 'পরিবারের জন্য দোয়া', titleEn: 'For Family', arabic: 'رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا', bangla: 'হে আমাদের রব! আমাদের স্ত্রী ও সন্তানদের থেকে আমাদের চোখের শীতলতা দাও এবং আমাদেরকে মুত্তাকিদের নেতা বানাও।', english: 'Our Lord, grant us from among our wives and offspring comfort to our eyes and make us an example for the righteous.', reference: 'সূরা ফুরকান: ৭৪' },
      { titleBn: 'মাতা-পিতার জন্য দোয়া', titleEn: 'For Parents', arabic: 'رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا', bangla: 'হে আমার রব! তাদের উপর দয়া করো যেভাবে তারা আমাকে শিশুকালে লালন-পালন করেছে।', english: 'My Lord, have mercy upon them as they brought me up when I was small.', reference: 'সূরা বনি ইসরাইল: ২৪' },
    ]
  },
  {
    id: 'knowledge', icon: '📚', color: '#06b6d4',
    nameBn: 'জ্ঞান ও হেদায়েত', nameEn: 'Knowledge & Guidance',
    duas: [
      { titleBn: 'জ্ঞান বৃদ্ধির দোয়া', titleEn: 'For Increase in Knowledge', arabic: 'رَّبِّ زِدْنِي عِلْمًا', bangla: 'হে আমার রব! আমার জ্ঞান বাড়িয়ে দাও।', english: 'My Lord, increase me in knowledge.', reference: 'সূরা ত্বহা: ১১৪' },
      { titleBn: 'হেদায়েতের দোয়া', titleEn: 'For Guidance', arabic: 'اللَّهُمَّ اهْدِنِي وَسَدِّدْنِي', bangla: 'হে আল্লাহ! আমাকে হেদায়েত দাও এবং সঠিক পথে রাখো।', english: 'O Allah, guide me and keep me steadfast.', reference: 'মুসলিম' },
      { titleBn: 'উপকারী জ্ঞানের দোয়া', titleEn: 'For Beneficial Knowledge', arabic: 'اللَّهُمَّ انْفَعْنِي بِمَا عَلَّمْتَنِي وَعَلِّمْنِي مَا يَنْفَعُنِي وَزِدْنِي عِلْمًا', bangla: 'হে আল্লাহ! তুমি আমাকে যা শিখিয়েছো তা দিয়ে আমাকে উপকৃত করো। আমাকে উপকারী জিনিস শিখিয়ে দাও এবং আমার জ্ঞান বাড়িয়ে দাও।', english: 'O Allah, benefit me with what You have taught me, teach me what will benefit me, and increase me in knowledge.', reference: 'তিরমিযি' },
    ]
  },
]

export default function DuaPage() {
  const [lang, setLang] = useState('bn')
  const [selectedCat, setSelectedCat] = useState(null)
  const [expandedDua, setExpandedDua] = useState(null)
  const [favorites, setFavorites] = useState([])
  const [showFav, setShowFav] = useState(false)
  const [copied, setCopied] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const savedLang = localStorage.getItem('nurapp_lang') || 'bn'
    setLang(savedLang)
    const savedFav = localStorage.getItem('dua_favorites')
    if (savedFav) setFavorites(JSON.parse(savedFav))
  }, [])

  const toggleLang = () => {
    const nl = lang === 'bn' ? 'en' : 'bn'
    setLang(nl)
    localStorage.setItem('nurapp_lang', nl)
  }

  const toggleFav = (catId, duaIndex) => {
    const key = `${catId}-${duaIndex}`
    const updated = favorites.includes(key) ? favorites.filter(f => f !== key) : [...favorites, key]
    setFavorites(updated)
    localStorage.setItem('dua_favorites', JSON.stringify(updated))
  }

  const copyDua = (text, key) => {
    navigator.clipboard?.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const totalDuas = DUA_CATEGORIES.reduce((sum, cat) => sum + cat.duas.length, 0)

  const allFavDuas = favorites.map(key => {
    const [catId, di] = key.split('-')
    const cat = DUA_CATEGORIES.find(c => c.id === catId)
    if (!cat) return null
    return { ...cat.duas[parseInt(di)], catName: lang === 'bn' ? cat.nameBn : cat.nameEn, catColor: cat.color, key }
  }).filter(Boolean)

  const searchResults = search.length > 1 ? DUA_CATEGORIES.flatMap(cat =>
    cat.duas.map((dua, i) => ({ ...dua, catId: cat.id, duaIndex: i, catName: lang === 'bn' ? cat.nameBn : cat.nameEn, catColor: cat.color }))
  ).filter(dua =>
    dua.arabic.includes(search) ||
    dua.bangla.includes(search) ||
    dua.english.toLowerCase().includes(search.toLowerCase()) ||
    (lang === 'bn' ? dua.titleBn : dua.titleEn).includes(search)
  ) : []

  return (
    <main className="min-h-screen pb-28" style={{ background: 'var(--bg-primary)' }}>

      <header className="sticky top-0 z-50 header-blur">
        <div className="px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {selectedCat && !showFav ? (
              <button onClick={() => { setSelectedCat(null); setExpandedDua(null); setSearch('') }} className="btn-icon">
                <ChevronLeftIcon size={18} color="var(--text-secondary)" />
              </button>
            ) : (
              <Link href="/" className="btn-icon">
                <ChevronLeftIcon size={18} color="var(--text-secondary)" />
              </Link>
            )}
            <div>
              <h1 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                {showFav ? (lang === 'bn' ? 'পছন্দের দোয়া' : 'Favorite Duas') :
                 selectedCat ? (lang === 'bn' ? DUA_CATEGORIES.find(c=>c.id===selectedCat)?.nameBn : DUA_CATEGORIES.find(c=>c.id===selectedCat)?.nameEn) :
                 (lang === 'bn' ? 'দোয়া ও দরুদ' : 'Duas & Salawat')}
              </h1>
              {!selectedCat && !showFav && (
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {totalDuas} {lang === 'bn' ? 'টি দোয়া' : 'duas'} • {DUA_CATEGORIES.length} {lang === 'bn' ? 'টি বিভাগ' : 'categories'}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => { setShowFav(!showFav); setSelectedCat(null) }} className="btn-icon"
              style={{ background: showFav ? 'rgba(239,68,68,0.15)' : undefined }}>
              <HeartIcon size={16} color={showFav ? '#ef4444' : 'var(--text-secondary)'} filled={showFav} />
            </button>
            <button onClick={toggleLang} className="btn-icon">
              <span className="text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>
                {lang === 'bn' ? 'EN' : 'বাং'}
              </span>
            </button>
          </div>
        </div>
      </header>

      <div className="px-5 pt-5">

        {/* Favorites */}
        {showFav && (
          <div className="space-y-3">
            {allFavDuas.length === 0 ? (
              <div className="text-center py-16 rounded-3xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <HeartIcon size={40} color="var(--text-muted)" />
                <p className="mt-4 font-semibold" style={{ color: 'var(--text-secondary)' }}>
                  {lang === 'bn' ? 'কোনো পছন্দের দোয়া নেই' : 'No favorite duas yet'}
                </p>
              </div>
            ) : allFavDuas.map((dua, i) => (
              <DuaCard key={i} dua={dua} lang={lang} isFav={true}
                isExpanded={expandedDua === `fav-${i}`}
                onToggle={() => setExpandedDua(expandedDua === `fav-${i}` ? null : `fav-${i}`)}
                onFav={() => toggleFav(dua.catId, dua.duaIndex)}
                onCopy={() => copyDua(dua.arabic, `fav-${i}`)}
                copied={copied === `fav-${i}`}
                accentColor={dua.catColor} />
            ))}
          </div>
        )}

        {/* Category Grid */}
        {!showFav && !selectedCat && (
          <>
            {/* Banner */}
            <div className="arabic-card text-center mb-5">
              <p className="font-arabic text-2xl mb-1" style={{ color: '#fde68a' }}>ادْعُونِي أَسْتَجِبْ لَكُمْ</p>
              <p className="text-xs" style={{ color: '#10b981' }}>
                {lang === 'bn' ? '"তোমরা আমাকে ডাকো, আমি সাড়া দেব" — সূরা গাফির: ৬০' : '"Call upon Me; I will respond to you." — Surah Ghafir: 60'}
              </p>
            </div>

            {/* Search */}
            <div className="relative mb-5">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <SearchIcon size={16} color="var(--text-muted)" />
              </div>
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder={lang === 'bn' ? 'দোয়া খুঁজুন...' : 'Search duas...'}
                className="input-field" style={{ paddingLeft: '44px' }} />
            </div>

            {/* Search Results */}
            {search.length > 1 ? (
              <div className="space-y-3">
                <p className="section-title">{searchResults.length} {lang === 'bn' ? 'টি ফলাফল' : 'results'}</p>
                {searchResults.map((dua, i) => {
                  const key = `search-${i}`
                  return (
                    <DuaCard key={i} dua={dua} lang={lang}
                      isFav={favorites.includes(`${dua.catId}-${dua.duaIndex}`)}
                      isExpanded={expandedDua === key}
                      onToggle={() => setExpandedDua(expandedDua === key ? null : key)}
                      onFav={() => toggleFav(dua.catId, dua.duaIndex)}
                      onCopy={() => copyDua(dua.arabic, key)}
                      copied={copied === key}
                      accentColor={dua.catColor}
                      subtitle={dua.catName} />
                  )
                })}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {DUA_CATEGORIES.map((cat, i) => (
                  <button key={cat.id} onClick={() => setSelectedCat(cat.id)}
                    className="rounded-2xl p-4 text-left transition-all animate-fadeInUp card-hover"
                    style={{
                      animationDelay: `${i * 0.05}s`,
                      animationFillMode: 'forwards',
                      opacity: 0
                    }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                      style={{ background: `${cat.color}15`, border: `1px solid ${cat.color}25` }}>
                      <span className="text-xl">{cat.icon}</span>
                    </div>
                    <p className="font-bold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>
                      {lang === 'bn' ? cat.nameBn : cat.nameEn}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {cat.duas.length} {lang === 'bn' ? 'টি দোয়া' : 'duas'}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {/* Dua List */}
        {!showFav && selectedCat && (
          <div className="space-y-3">
            {DUA_CATEGORIES.find(c => c.id === selectedCat)?.duas.map((dua, i) => {
              const key = `${selectedCat}-${i}`
              const isFav = favorites.includes(key)
              return (
                <DuaCard key={i} dua={dua} lang={lang} isFav={isFav}
                  isExpanded={expandedDua === key}
                  onToggle={() => setExpandedDua(expandedDua === key ? null : key)}
                  onFav={() => toggleFav(selectedCat, i)}
                  onCopy={() => copyDua(dua.arabic, key)}
                  copied={copied === key}
                  accentColor={DUA_CATEGORIES.find(c => c.id === selectedCat)?.color} />
              )
            })}
          </div>
        )}

        {/* Copyright */}
        <div className="mt-6 py-4 text-center" style={{ borderTop: '1px solid var(--border)' }}>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {lang === 'bn' ? 'তৈরি করেছেন' : 'Developed by'}{' '}
            <span className="font-bold" style={{ color: '#10b981' }}>Muhammad Shourov</span>
          </p>
        </div>
      </div>

      <BottomNav lang={lang} />
    </main>
  )
}

function DuaCard({ dua, lang, isFav, isExpanded, onToggle, onFav, onCopy, copied, accentColor = '#10b981', subtitle }) {
  return (
    <div className="overflow-hidden transition-all animate-fadeInUp"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '20px', animationFillMode: 'forwards', opacity: 0 }}>
      <button onClick={onToggle} className="w-full p-4 text-left">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            {subtitle && (
              <p className="text-xs font-semibold mb-1" style={{ color: accentColor }}>{subtitle}</p>
            )}
            <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
              {lang === 'bn' ? dua.titleBn : dua.titleEn}
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {lang === 'bn' ? `সূত্র: ${dua.reference}` : `Source: ${dua.reference}`}
            </p>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button onClick={e => { e.stopPropagation(); onFav() }} className="btn-icon" style={{ width: '30px', height: '30px' }}>
              <HeartIcon size={13} color={isFav ? '#ef4444' : 'var(--text-muted)'} filled={isFav} />
            </button>
            <button onClick={e => { e.stopPropagation(); onCopy() }} className="btn-icon" style={{ width: '30px', height: '30px' }}>
              {copied ? <CheckIcon size={13} color="#10b981" /> : <CopyIcon size={13} color="var(--text-muted)" />}
            </button>
            <div style={{ color: 'var(--text-muted)' }}>
              {isExpanded ? <ChevronUpIcon size={16} color="var(--text-muted)" /> : <ChevronDownIcon size={16} color="var(--text-muted)" />}
            </div>
          </div>
        </div>

        {/* Arabic Preview */}
        <p className="font-arabic text-lg text-right leading-loose mt-3" style={{ color: '#f1e8c8', direction: 'rtl' }}>
          {dua.arabic.length > 80 ? dua.arabic.substring(0, 80) + '...' : dua.arabic}
        </p>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-4" style={{ borderTop: '1px solid var(--border)' }}>
          {/* Full Arabic */}
          <div className="rounded-xl p-4 mt-4" style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.1)' }}>
            <p className="font-arabic text-2xl text-right leading-loose" style={{ color: '#f1e8c8', direction: 'rtl' }}>
              {dua.arabic}
            </p>
          </div>

          {/* Bangla */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#10b981' }}>
              {lang === 'bn' ? 'বাংলা অর্থ' : 'Bengali Meaning'}
            </p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{dua.bangla}</p>
          </div>

          {/* English */}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
            <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#60a5fa' }}>English</p>
            <p className="text-sm leading-relaxed italic" style={{ color: 'var(--text-muted)' }}>{dua.english}</p>
          </div>

          {/* Reference */}
          <div className="flex items-center justify-between rounded-xl px-3 py-2"
            style={{ background: `${accentColor}08`, border: `1px solid ${accentColor}15` }}>
            <p className="text-xs font-semibold" style={{ color: accentColor }}>
              {lang === 'bn' ? `সূত্র: ${dua.reference}` : `Source: ${dua.reference}`}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
