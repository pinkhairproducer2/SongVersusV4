
import React, { useState } from 'react';
import { Check, Zap, DollarSign, Crown, Shield, Star, Briefcase } from 'lucide-react';

const MEMBERSHIPS = [
  {
    name: 'FREE',
    price: 0,
    color: 'text-white',
    border: 'border-gray-700',
    bg: 'bg-dark-800',
    features: ['Unlimited Voting', 'Join Challenges', '48 Hours Unlimited Battles']
  },
  {
    name: 'SILVER',
    price: 4.99,
    color: 'text-gray-300',
    border: 'border-gray-500',
    bg: 'bg-gradient-to-b from-gray-800 to-black',
    features: ['Unlimited Voting', 'Join Challenges', '10 Battles per month']
  },
  {
    name: 'GOLD',
    price: 9.99,
    color: 'text-yellow-400',
    border: 'border-yellow-500',
    bg: 'bg-gradient-to-b from-yellow-900/20 to-black',
    features: ['Unlimited Voting', 'Join Challenges', 'Unlimited Battles', 'Seasonal Battle Rankings', 'Seasonal Tournament Entry'],
    recommended: true
  },
  {
    name: 'PLATINUM',
    price: 19.99,
    color: 'text-cyan-300',
    border: 'border-cyan-500',
    bg: 'bg-gradient-to-b from-cyan-900/20 to-black',
    features: ['Unlimited Voting', 'Join Challenges', 'Unlimited Battles', 'Seasonal Battle Rankings', 'Seasonal Tournament Entry', '250 Monthly Samples']
  },
  {
    name: 'DIAMOND',
    price: 29.99,
    color: 'text-purple-400',
    border: 'border-purple-500',
    bg: 'bg-gradient-to-b from-purple-900/20 to-black',
    features: ['Unlimited Voting', 'Join Challenges', 'Unlimited Battles', 'Seasonal Battle Rankings', 'Seasonal Tournament Entry', '400 Monthly Samples']
  }
];

const CURRENCY_PACKS = [
    { amount: 5000, cost: 4.99, bonus: '0' },
    { amount: 12000, cost: 9.99, bonus: '20%' },
    { amount: 30000, cost: 19.99, bonus: '50%' },
    { amount: 75000, cost: 49.99, bonus: '100%' },
];

const AMPS = [
    { name: 'Minor Boost', duration: '1 Hour', cost: 500, type: 'cash', icon: Zap, desc: 'Slight visibility increase.' },
    { name: 'Featured Slot', duration: '24 Hours', cost: 2500, type: 'cash', icon: Star, desc: 'Get on the Hottest tab.' },
    { name: 'Global Hype', duration: '3 Days', cost: 10000, type: 'cash', icon: Crown, desc: 'Front page domination.' },
];

const ShopPage: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <div className="max-w-[1600px] mx-auto px-4 lg:px-8 py-12 pb-24">
      
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-6xl font-display font-bold uppercase italic tracking-tighter mb-4 text-white">
          The <span className="text-green-500">Black Market</span>
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto font-mono text-sm">
           Gear up for the streets. Buy status, secure funding, and amplify your influence. 
           In this city, money talks and volume wins.
        </p>
      </div>

      {/* Memberships Section */}
      <div className="mb-24">
          <div className="flex justify-center mb-8">
              <div className="bg-dark-800 p-1 rounded-full border border-white/10 flex relative">
                   <div className="absolute -top-3 -right-3 bg-green-500 text-black text-[10px] font-bold px-2 py-0.5 rounded rotate-12 z-10">20% OFF</div>
                   <button 
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-6 py-2 rounded-full text-sm font-bold uppercase transition-all ${billingCycle === 'monthly' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
                   >
                       Monthly
                   </button>
                   <button 
                    onClick={() => setBillingCycle('yearly')}
                    className={`px-6 py-2 rounded-full text-sm font-bold uppercase transition-all ${billingCycle === 'yearly' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
                   >
                       Yearly
                   </button>
              </div>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
              {MEMBERSHIPS.map((tier) => (
                  <div key={tier.name} className={`relative flex flex-col p-6 rounded-xl border ${tier.border} ${tier.bg} hover:scale-105 transition-transform duration-300`}>
                      {tier.recommended && (
                          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-green-500 text-black font-display uppercase tracking-widest text-sm px-4 py-1 skew-x-[-10deg]">
                              Most Popular
                          </div>
                      )}
                      
                      <div className="text-center mb-6">
                          <h3 className={`font-display text-3xl italic uppercase ${tier.color}`}>{tier.name}</h3>
                          <div className="flex items-baseline justify-center mt-2">
                              <span className="text-xl text-gray-400 font-mono">$</span>
                              <span className="text-4xl font-bold text-white">{tier.price}</span>
                              <span className="text-gray-500 text-xs ml-1">/mo</span>
                          </div>
                      </div>

                      <button className={`w-full py-3 mb-6 font-display text-xl uppercase tracking-widest skew-x-[-5deg] hover:bg-white hover:text-black transition-colors border border-white/20 ${tier.price > 0 ? 'bg-green-600 text-white border-none hover:bg-green-500' : 'bg-white/10 text-white'}`}>
                          {tier.price === 0 ? 'Join Free' : 'Get Started'}
                      </button>

                      <div className="space-y-3 flex-1">
                          {tier.features.map((feat, i) => (
                              <div key={i} className="flex items-start gap-2 text-xs text-gray-300">
                                  <Check className={`w-4 h-4 shrink-0 ${tier.color}`} />
                                  <span>{feat}</span>
                              </div>
                          ))}
                      </div>
                  </div>
              ))}
          </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-16">
          
          {/* Currency Shop */}
          <div>
              <h2 className="text-3xl font-display uppercase italic text-white mb-6 flex items-center gap-3">
                  <Briefcase className="w-8 h-8 text-green-500" /> Laundry Service <span className="text-xs font-sans not-italic text-gray-500 bg-dark-800 px-2 py-1 rounded border border-white/10">BUY CASH</span>
              </h2>
              <div className="grid grid-cols-2 gap-4">
                  {CURRENCY_PACKS.map((pack, i) => (
                      <div key={i} className="bg-dark-800 border border-white/10 p-6 rounded-lg group hover:border-green-500 transition-colors cursor-pointer relative overflow-hidden">
                          {pack.bonus !== '0' && (
                              <div className="absolute top-0 right-0 bg-green-600 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">
                                  +{pack.bonus} BONUS
                              </div>
                          )}
                          <div className="flex justify-between items-center mb-2">
                              <DollarSign className="w-8 h-8 text-green-500 group-hover:scale-110 transition-transform" />
                              <span className="font-mono text-white text-lg">${pack.cost}</span>
                          </div>
                          <div className="text-3xl font-hud text-white group-hover:text-green-400 transition-colors">
                              ${pack.amount.toLocaleString()}
                          </div>
                          <div className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">In-Game Cash</div>
                      </div>
                  ))}
              </div>
          </div>

          {/* AMP Shop */}
          <div>
               <h2 className="text-3xl font-display uppercase italic text-white mb-6 flex items-center gap-3">
                  <Zap className="w-8 h-8 text-neon-pink" /> The Lab <span className="text-xs font-sans not-italic text-gray-500 bg-dark-800 px-2 py-1 rounded border border-white/10">BUY AMPS</span>
              </h2>
              <div className="space-y-4">
                  {AMPS.map((amp, i) => (
                      <div key={i} className="bg-dark-800 border border-white/10 p-4 rounded-lg flex items-center gap-4 group hover:border-neon-pink transition-colors cursor-pointer">
                          <div className="w-16 h-16 bg-black rounded border border-white/10 flex items-center justify-center group-hover:border-neon-pink/50">
                              <amp.icon className="w-8 h-8 text-white group-hover:text-neon-pink transition-colors" />
                          </div>
                          <div className="flex-1">
                              <h3 className="font-display text-xl uppercase text-white">{amp.name}</h3>
                              <p className="text-gray-400 text-xs">{amp.desc}</p>
                              <div className="text-neon-cyan text-[10px] font-mono mt-1 flex items-center gap-1">
                                  <ClockIcon /> DURATION: {amp.duration}
                              </div>
                          </div>
                          <button className="bg-white/5 hover:bg-white/10 border border-white/20 text-white px-6 py-2 font-hud text-xl uppercase tracking-widest skew-x-[-10deg]">
                              ${amp.cost}
                          </button>
                      </div>
                  ))}
              </div>
          </div>

      </div>

    </div>
  );
};

const ClockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);

export default ShopPage;
