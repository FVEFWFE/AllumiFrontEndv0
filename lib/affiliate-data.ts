import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface AffiliateStats {
  totalEarnings: number;
  pendingEarnings: number;
  paidEarnings: number;
  totalReferrals: number;
  activeReferrals: number;
  conversionRate: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  nextTierProgress: number;
}

export interface AffiliateReferral {
  id: string;
  referredUserName: string;
  referredUserEmail: string;
  referralDate: string;
  status: 'pending' | 'converted' | 'expired';
  revenue: number;
  commission: number;
  commissionStatus: 'pending' | 'approved' | 'paid';
}

export interface TopAffiliate {
  id: string;
  name: string;
  email: string;
  referrals: number;
  earnings: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  joinedDate: string;
}

export async function getAffiliateStats(userId: string): Promise<AffiliateStats> {
  try {
    // Get all referrals for this affiliate
    const { data: referrals } = await supabase
      .from('affiliate_referrals')
      .select('*')
      .eq('affiliate_id', userId);

    if (!referrals || referrals.length === 0) {
      return {
        totalEarnings: 0,
        pendingEarnings: 0,
        paidEarnings: 0,
        totalReferrals: 0,
        activeReferrals: 0,
        conversionRate: 0,
        tier: 'bronze',
        nextTierProgress: 0
      };
    }

    // Calculate earnings
    const totalEarnings = referrals.reduce((sum, r) => sum + (r.commission_amount || 0), 0);
    const pendingEarnings = referrals
      .filter(r => r.commission_status === 'pending')
      .reduce((sum, r) => sum + (r.commission_amount || 0), 0);
    const paidEarnings = referrals
      .filter(r => r.commission_status === 'paid')
      .reduce((sum, r) => sum + (r.commission_amount || 0), 0);

    // Count referrals
    const totalReferrals = referrals.length;
    const activeReferrals = referrals.filter(r => r.converted_at).length;
    const conversionRate = totalReferrals > 0 ? (activeReferrals / totalReferrals) * 100 : 0;

    // Determine tier based on total earnings
    let tier: 'bronze' | 'silver' | 'gold' | 'platinum' = 'bronze';
    let nextTierProgress = 0;

    if (totalEarnings >= 10000) {
      tier = 'platinum';
      nextTierProgress = 100;
    } else if (totalEarnings >= 5000) {
      tier = 'gold';
      nextTierProgress = ((totalEarnings - 5000) / 5000) * 100;
    } else if (totalEarnings >= 1000) {
      tier = 'silver';
      nextTierProgress = ((totalEarnings - 1000) / 4000) * 100;
    } else {
      tier = 'bronze';
      nextTierProgress = (totalEarnings / 1000) * 100;
    }

    return {
      totalEarnings,
      pendingEarnings,
      paidEarnings,
      totalReferrals,
      activeReferrals,
      conversionRate: Math.round(conversionRate),
      tier,
      nextTierProgress: Math.min(100, Math.round(nextTierProgress))
    };
  } catch (error) {
    console.error('Error fetching affiliate stats:', error);
    return {
      totalEarnings: 0,
      pendingEarnings: 0,
      paidEarnings: 0,
      totalReferrals: 0,
      activeReferrals: 0,
      conversionRate: 0,
      tier: 'bronze',
      nextTierProgress: 0
    };
  }
}

export async function getAffiliateReferrals(userId: string): Promise<AffiliateReferral[]> {
  try {
    const { data: referrals } = await supabase
      .from('affiliate_referrals')
      .select(`
        *,
        users!affiliate_referrals_referred_user_id_fkey (
          id,
          email,
          full_name
        )
      `)
      .eq('affiliate_id', userId)
      .order('referred_at', { ascending: false });

    if (!referrals || referrals.length === 0) {
      return [];
    }

    return referrals.map(referral => {
      const status = referral.converted_at ? 'converted' :
                    new Date(referral.referred_at) < new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) ?
                    'expired' : 'pending';

      return {
        id: referral.id,
        referredUserName: referral.users?.full_name || 'Unknown User',
        referredUserEmail: referral.users?.email || 'unknown@email.com',
        referralDate: referral.referred_at,
        status,
        revenue: referral.commission_amount ? referral.commission_amount / 0.4 : 0, // Calculate revenue from commission
        commission: referral.commission_amount || 0,
        commissionStatus: referral.commission_status || 'pending'
      };
    });
  } catch (error) {
    console.error('Error fetching affiliate referrals:', error);
    return [];
  }
}

export async function getTopAffiliates(limit: number = 10): Promise<TopAffiliate[]> {
  try {
    // Get all affiliates with their referral counts and earnings
    const { data: affiliates } = await supabase
      .from('affiliate_referrals')
      .select(`
        affiliate_id,
        commission_amount,
        users!affiliate_referrals_affiliate_id_fkey (
          id,
          email,
          full_name,
          created_at
        )
      `);

    if (!affiliates || affiliates.length === 0) {
      return [];
    }

    // Group by affiliate
    const affiliateMap: { [key: string]: any } = {};

    affiliates.forEach(referral => {
      const id = referral.affiliate_id;
      if (!affiliateMap[id]) {
        affiliateMap[id] = {
          id,
          name: referral.users?.full_name || 'Unknown Affiliate',
          email: referral.users?.email || 'unknown@email.com',
          joinedDate: referral.users?.created_at || new Date().toISOString(),
          referrals: 0,
          earnings: 0
        };
      }
      affiliateMap[id].referrals++;
      affiliateMap[id].earnings += referral.commission_amount || 0;
    });

    // Convert to array and sort by earnings
    const topAffiliates = Object.values(affiliateMap)
      .sort((a, b) => b.earnings - a.earnings)
      .slice(0, limit)
      .map((affiliate: any) => {
        // Determine tier based on earnings
        let tier: 'bronze' | 'silver' | 'gold' | 'platinum' = 'bronze';
        if (affiliate.earnings >= 10000) tier = 'platinum';
        else if (affiliate.earnings >= 5000) tier = 'gold';
        else if (affiliate.earnings >= 1000) tier = 'silver';

        return {
          id: affiliate.id,
          name: affiliate.name,
          email: affiliate.email,
          referrals: affiliate.referrals,
          earnings: affiliate.earnings,
          tier,
          joinedDate: affiliate.joinedDate
        };
      });

    return topAffiliates;
  } catch (error) {
    console.error('Error fetching top affiliates:', error);
    return [];
  }
}

export async function generateAffiliateCode(userId: string): Promise<string> {
  try {
    // Generate a unique code
    const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const code = `AFF${randomCode}`;

    // Save to user profile
    const { error } = await supabase
      .from('users')
      .update({ affiliate_code: code })
      .eq('id', userId);

    if (error) {
      console.error('Error saving affiliate code:', error);
      return '';
    }

    return code;
  } catch (error) {
    console.error('Error generating affiliate code:', error);
    return '';
  }
}

export async function getAffiliateCode(userId: string): Promise<string> {
  try {
    const { data: user } = await supabase
      .from('users')
      .select('affiliate_code')
      .eq('id', userId)
      .single();

    if (user?.affiliate_code) {
      return user.affiliate_code;
    }

    // Generate new code if doesn't exist
    return await generateAffiliateCode(userId);
  } catch (error) {
    console.error('Error getting affiliate code:', error);
    return '';
  }
}