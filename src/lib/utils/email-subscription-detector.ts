import { EmailMessage } from "@/lib/utils/email-providers";

export interface DetectedSubscription {
  name: string;
  amount: number;
  currency: string;
  billingCycle: string;
  nextBilling: string;
  confidence: number;
  category?: string;
}

export function detectSubscriptionsFromEmailContent(messages: EmailMessage[]): DetectedSubscription[] {
  const subscriptions: DetectedSubscription[] = [];
  
  const subscriptionKeywords = [
    'subscription', 'recurring', 'monthly', 'annual', 'billing', 'invoice',
    'payment', 'charge', 'renewal', 'auto-pay', 'membership'
  ];
  
  const priceRegex = /\$(\d+(?:\.\d{2})?)/g;
  const currencyRegex = /([£€$¥])(\d+(?:\.\d{2})?)/g;
  
  messages.forEach(message => {
    const content = `${message.subject} ${message.body}`.toLowerCase();
    
    const hasSubscriptionKeywords = subscriptionKeywords.some(keyword => 
      content.includes(keyword)
    );
    
    if (hasSubscriptionKeywords) {
      const priceMatches = content.match(priceRegex);
      const currencyMatches = content.match(currencyRegex);
      
      if (priceMatches || currencyMatches) {
        const amount = priceMatches ? 
          parseFloat(priceMatches[0].replace('$', '')) : 
          parseFloat((currencyMatches?.[0] || '0').replace(/[£€$¥]/, ''));
        
        const billingCycle = content.includes('annual') || content.includes('yearly') ? 
          'yearly' : 'monthly';
        
        subscriptions.push({
          name: message.from.split('@')[0] || 'Unknown Service',
          amount,
          currency: 'USD',
          billingCycle,
          nextBilling: new Date(Date.now() + (billingCycle === 'yearly' ? 365 : 30) * 24 * 60 * 60 * 1000).toISOString(),
          confidence: 0.7
        });
      }
    }
  });
  
  return subscriptions;
}