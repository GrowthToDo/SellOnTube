"""
Insert topicExamples, industryFaqs, and commonMistakes into niches.ts
for all 29 niches, before each ctaHeading line.
"""
import re

NICHE_CONTENT = {
    'saas': {
        'topicExamples': [
            'best CRM software for B2B startups 2025',
            'HubSpot vs Salesforce for small sales teams',
            'Notion vs ClickUp for remote engineering teams',
            'best project management tool for agencies',
            'is [software category] worth it for small teams',
            'how to choose customer success software',
            'best billing software for SaaS companies',
        ],
        'industryFaqs': [
            {
                'question': 'Do we need a free tier to make YouTube work for our SaaS?',
                'answer': "No. Free trials help conversion but are not required. Videos targeting buying-intent queries—comparison searches, best-of lists for specific use cases—drive demo requests and paid trial signups just as effectively for paid-only tools. The key is targeting searches from people who have already committed to solving the problem, not people still deciding whether to.",
            },
            {
                'question': 'What if a competitor already has strong YouTube presence?',
                'answer': "Competitors with established channels typically have broad educational content, not bottom-of-funnel buying videos. Target the specific comparison queries and use-case searches they aren't covering. In our experience, gaps in competitor YouTube libraries are more common than full coverage, even in crowded software categories.",
            },
            {
                'question': 'How do we handle YouTube videos that mention our pricing?',
                'answer': "Mention pricing ranges honestly. Videos that dodge the question rank fine but underperform on conversion. Buyers evaluating software want to know if it is in their budget before they book a demo. A video that answers the pricing question directly converts better than one that sends them elsewhere to find out.",
            },
        ],
        'commonMistakes': [
            {
                'title': 'Producing product tutorials instead of buying-intent content',
                'description': "Tutorial videos serve existing users. They do not convert prospects. A video titled 'How to set up automations in [Product]' gets watched by people already using the tool. A video titled 'Best automation software for small sales teams' gets watched by people deciding what to buy. The research phase, not the onboarding phase, is where YouTube drives acquisition.",
            },
            {
                'title': 'Targeting high-volume head terms dominated by review sites',
                'description': "Searching 'CRM software' on YouTube surfaces reviews from established channels with hundreds of thousands of subscribers. New channels cannot compete there. The winning approach for most SaaS companies is targeting the longer, more specific queries—'best CRM for freelance designers' or 'CRM for real estate teams under 10 people'—where search volume is lower but competition is near zero.",
            },
            {
                'title': 'Skipping the comparison angle entirely',
                'description': "Comparison searches ('X vs Y', 'best X for Y use case') represent the last search before a software buying decision. Most SaaS companies avoid these because they feel uncomfortable naming competitors. That discomfort is the opportunity. If you do not produce the comparison video, a third party will, and they will control the narrative.",
            },
        ],
    },
    'coaches': {
        'topicExamples': [
            'best executive coach for senior managers',
            'is business coaching worth the investment',
            'how to find a career coach for career change',
            'leadership coaching programs for first-time CEOs',
            'life coach vs therapist for anxiety',
            'health coach for busy executives',
            'best online coaching programs for entrepreneurs',
        ],
        'industryFaqs': [
            {
                'question': "Does YouTube work for coaches who don't have a large following?",
                'answer': "Follower count is irrelevant for bottom-of-funnel acquisition. A channel with 200 subscribers and one video that ranks for 'best executive coach for startup founders' will generate discovery calls. A channel with 50,000 subscribers full of motivational content will not. We optimise for search placement, not audience size.",
            },
            {
                'question': 'What if clients want to see my personality before booking?',
                'answer': "Voiceover videos reveal personality through reasoning, word choice, and the quality of thinking, not just through appearing on camera. Discovery calls remain the place where the relationship decision is made. The YouTube video's job is to establish credibility and get the booking, not to replace the call.",
            },
            {
                'question': 'What coaching niches work best on YouTube?',
                'answer': "B2B coaching categories with higher program pricing work best: executive coaching, leadership development, career coaching for specific professions, business coaching for a defined audience. Consumer life coaching categories are more crowded and have lower LTV. The narrower and more specific the niche, the faster ranking happens and the better the conversion rate.",
            },
        ],
        'commonMistakes': [
            {
                'title': 'Publishing motivational content instead of buyer-intent videos',
                'description': "Inspirational shorts and broad coaching tips attract an audience that is nowhere near buying. The viewer watching 'morning routine tips' is not the same person searching 'executive coach for burned-out founders'. One is passive content consumption. The other is active research. All production effort should go to the second category.",
            },
            {
                'title': 'Optimising for views instead of discovery calls',
                'description': "A coach who measures success by view count will produce content designed to go wide. Broad content gets watched, not acted on. The right metric is discovery calls booked. A video with 600 views that generates three bookings is a better business asset than a video with 60,000 views that generates none.",
            },
            {
                'title': 'No clear next step after the video',
                'description': "Many coaching videos end without telling the viewer what to do. The description has a newsletter link. The CTA says 'subscribe for more'. Viewers who want to book do not know how. Every video should end with one specific instruction: book a discovery call, with the booking link in the first line of the description.",
            },
        ],
    },
    'agencies': {
        'topicExamples': [
            'best digital marketing agency for B2B SaaS',
            'how to choose a content marketing agency',
            'marketing agency vs in-house team pros and cons',
            'best SEO agency for e-commerce brands',
            'paid media agency for B2B lead generation',
            'how to evaluate a creative agency before hiring',
            'agency retainer vs project pricing explained',
        ],
        'industryFaqs': [
            {
                'question': "Won't clients find it strange that we market ourselves on YouTube?",
                'answer': "No. If anything, a marketing agency with a visible YouTube presence signals credibility. A client considering hiring you for content strategy will notice that you practice what you advise. Agencies without any content presence have a harder time justifying their services than agencies that demonstrate the approach in public.",
            },
            {
                'question': 'We serve multiple verticals. How do we pick which to target on YouTube?',
                'answer': "Start with the vertical that produces your highest LTV clients, or the one where you have the strongest demonstrated results. A video titled 'best digital marketing agency for B2B SaaS' will rank faster and convert better than a video trying to appeal to all verticals simultaneously.",
            },
            {
                'question': "Our services are custom. Is it a problem that we can't show pricing in videos?",
                'answer': "No. Prospect research videos are not primarily about pricing—they are about determining whether your agency understands their situation. A video that demonstrates deep knowledge of a prospect's specific business problem converts even without a price mentioned. The goal is to move them from research to a conversation.",
            },
        ],
        'commonMistakes': [
            {
                'title': 'Publishing thought leadership instead of prospect research content',
                'description': "Agency YouTube channels are full of videos about marketing trends, industry predictions, and methodology explanations. These videos attract other marketers, not prospective clients. A CMO researching agencies is not watching your thoughts on the future of content marketing. They are watching 'best content marketing agency for B2B SaaS companies 2025'.",
            },
            {
                'title': "Using the agency's own content team to produce the videos",
                'description': "Agency content teams default to producing the kind of content they know: brand storytelling, trend commentary, creative formats. This is the wrong type of content for client acquisition. Bottom-of-funnel agency videos need keyword research, search optimisation, and a fundamentally different brief than the content agencies produce for their clients.",
            },
            {
                'title': 'No vertical focus in early videos',
                'description': "Agencies that produce generic videos about 'choosing a marketing agency' compete with every other agency on YouTube. Agencies that produce videos about 'choosing a paid media agency for DTC e-commerce brands' compete with almost no one. The narrower the vertical, the faster ranking happens and the more qualified the prospect who finds the video.",
            },
        ],
    },
    'consultants': {
        'topicExamples': [
            'best management consultant for supply chain optimization',
            'how to choose a business consultant',
            'strategy consultant vs management consultant difference',
            'operations consultant for manufacturing companies',
            'business process consultant for scaling startups',
            'hiring a consultant vs building in-house team',
            'how much does management consulting cost',
        ],
        'industryFaqs': [
            {
                'question': 'Does YouTube work for solo consultants, not just large firms?',
                'answer': "Solo consultants often have an advantage. A video featuring a single expert voice with a specific point of view is more credible and watchable than corporate content. A solo consultant with genuine expertise in a specific domain can rank for that domain's research queries and convert at a higher rate than a firm video trying to cover too many services.",
            },
            {
                'question': 'Our engagements are highly confidential. Can we still make compelling videos?',
                'answer': "Yes. Case studies are not required for high-converting consultant videos. Videos that explain the problem framework, the approach, and what good outcomes look like give a prospect enough to evaluate whether to reach out. Specificity of methodology and outcome language matters more than specific client names.",
            },
            {
                'question': 'How long do consulting clients take to decide after finding us on YouTube?',
                'answer': "Longer than SaaS, shorter than referral cycles. A consultant found via YouTube typically moves to a scoping call within 2 to 8 weeks of discovery. The prospect usually watches multiple videos before reaching out. Building a library of 4 to 6 interlinked videos accelerates the trust formation and shortens the decision cycle.",
            },
        ],
        'commonMistakes': [
            {
                'title': 'Positioning too broadly across service lines',
                'description': "A consultant who labels themselves a 'business growth consultant' on YouTube competes with every other consultant on the platform. A consultant who targets 'supply chain optimization for mid-market manufacturers' ranks faster and attracts prospects already looking for exactly that. Specificity is not a limitation—it is what makes the channel findable.",
            },
            {
                'title': 'Overemphasis on methodology instead of outcomes',
                'description': "Consultants naturally talk about how they work. Prospects search for results. A video about 'our 5-step consulting framework' attracts almost nobody. A video about 'how to reduce manufacturing costs by 15%' attracts the exact buyer who has that problem. Lead with the outcome in the title and methodology in the body of the video.",
            },
            {
                'title': "Waiting until the methodology is 'ready to share publicly'",
                'description': "Many consultants delay YouTube because they're concerned about IP or competitive exposure. In practice, explaining your approach publicly builds credibility rather than giving away the value. Prospects cannot replicate a consultant's judgment from a 10-minute video. What they can do is decide to hire you because you clearly understand their problem.",
            },
        ],
    },
    'b2b-companies': {
        'topicExamples': [
            'best B2B sales tools for outbound teams',
            'how to evaluate B2B software vendors',
            'B2B marketing strategy for manufacturing companies',
            'enterprise software comparison for operations teams',
            'best B2B procurement platforms 2025',
            'how to build a B2B partner channel',
            'B2B lead generation that does not rely on ads',
        ],
        'industryFaqs': [
            {
                'question': 'Our sales cycle is 6 to 12 months. Can YouTube influence a decision that slow?',
                'answer': "Yes, and it's particularly powerful for long cycles. B2B buyers spend months in a research phase before they ever reach out. YouTube is where that research happens. A company that shows up consistently across multiple research searches builds familiarity before the first call. By the time a prospect reaches out, they have already formed an opinion about your credibility. That opinion started with the videos they found.",
            },
            {
                'question': 'We sell through a channel partner network, not direct. Does YouTube still help?',
                'answer': "YouTube works for channel-driven businesses in two ways: it surfaces you in the end-buyer's research (even if the transaction runs through a partner) and it helps partners justify recommending you over competitors. Partners who see you in YouTube search results have an easier conversation with their own clients about why they recommend you.",
            },
            {
                'question': 'What types of B2B videos generate the most qualified leads?',
                'answer': "Comparison videos between your solution and direct alternatives, use-case videos for specific buyer personas, and 'how to choose' videos for your category. These three formats consistently attract buyers in active evaluation mode across B2B sectors.",
            },
        ],
        'commonMistakes': [
            {
                'title': "Producing company culture and 'about us' content",
                'description': "B2B YouTube channels often start with brand videos: company story, team culture, values content. These videos perform on LinkedIn, where existing contacts engage with them. On YouTube, where discovery happens through search, no one searches for your company values. Every production slot used on brand content is a slot not used on the buyer-research content that drives pipeline.",
            },
            {
                'title': "Skipping YouTube because the buying committee is small",
                'description': "B2B companies often assume that because they're selling to a committee of 3 to 5 people, YouTube's scale is irrelevant. In reality, even a video that generates 200 views per month and converts at 1% yields 2 qualified inbound contacts per month. Over a year, that's 24 inbound contacts from one video—without any additional spend.",
            },
            {
                'title': 'Treating YouTube as a product demo platform',
                'description': "Product walkthroughs belong on your website and in sales follow-up. YouTube is for the pre-awareness to awareness phase—when a buyer is researching whether a category of solution can solve their problem and which vendors seem worth talking to. Content that assumes the viewer is already sold on your product will only reach people who already know you.",
            },
        ],
    },
    'course-creators': {
        'topicExamples': [
            'best online course for data science beginners',
            'is [topic] course worth it review',
            '[skill] course vs self-teaching comparison',
            'best programming course for career change',
            'online MBA program alternatives comparison',
            'how to choose an online certification program',
            'best course for learning digital marketing 2025',
        ],
        'industryFaqs': [
            {
                'question': "Won't my course content compete with my YouTube videos?",
                'answer': "Your YouTube videos and your course content are for different stages of the buyer journey. YouTube videos target people deciding whether to invest in learning a skill and whether your course is the right vehicle. Course content delivers the transformation that was promised. They do not compete—they serve different purposes for the same person at different points in time.",
            },
            {
                'question': 'What if my course is new and I have no reviews yet?',
                'answer': "A new course without reviews can still rank for research queries through the quality of the video content itself. Addressing the 'is this course worth it?' question directly—explaining who the course is for, what they will be able to do after it, and who it is not right for—converts better than testimonial-only content. Early purchasers can be actively invited to leave reviews to accelerate the social proof cycle.",
            },
            {
                'question': 'How do I handle comparison videos that mention my competitors?',
                'answer': "Comparison videos are among the highest-converting content for course creators. The viewer watching 'Course A vs Course B for learning [skill]' has already decided to enrol somewhere and is making a final choice. Being in that video—or having your own comparison video—is worth far more than a broad 'why our course is great' production.",
            },
        ],
        'commonMistakes': [
            {
                'title': 'Giving away too much course content for free',
                'description': "Course creators often structure YouTube videos as mini lessons from their curriculum. This confuses the acquisition goal. The YouTube video's job is to convince someone to buy the course, not to deliver part of it. A video that teaches the viewer enough that they no longer need the course is not an acquisition asset. A video that shows the viewer what they will be capable of after the course, and why doing it alone is slower, is.",
            },
            {
                'title': 'Optimising for teaching quality instead of buyer conversion',
                'description': "Educators naturally want to produce the best-taught video. That instinct produces valuable educational content that attracts learners who watch and never buy. Bottom-of-funnel course acquisition videos are evaluated by how well they address buyer objections—price, time investment, prior knowledge required—not by how good the explanation is.",
            },
            {
                'title': "Not targeting the 'is it worth it' search",
                'description': "One of the highest-converting searches for any course category is '[course type] worth it'. These viewers have already decided they want to learn the skill. They are deciding whether a formal course is the right approach. A video that answers this directly and honestly converts into enrollments at a rate that broad 'intro to the topic' content never will.",
            },
        ],
    },
    'financial-advisors': {
        'topicExamples': [
            'how to find a financial advisor I can trust',
            'fee-only financial advisor vs commission-based',
            'when should I hire a financial advisor',
            'financial advisor for small business owners',
            'best retirement planning advisor for self-employed',
            'do I need a financial advisor or can I DIY',
            'fiduciary financial advisor explained',
        ],
        'industryFaqs': [
            {
                'question': "Are there regulatory constraints on what we can say on YouTube?",
                'answer': "Yes, and we work within them. The highest-converting financial advisor YouTube content is educational and explanatory rather than promotional—explaining frameworks, criteria for decisions, and how to evaluate advisors in general. This content type converts well because it builds trust, and it avoids the regulatory pitfalls of specific performance claims or personalised advice.",
            },
            {
                'question': "Our firm serves HNW clients who don't find advisors on YouTube.",
                'answer': "High-net-worth individuals use YouTube research more than most financial advisors realise. A 55-year-old business owner selling their company will search 'how to handle a business sale windfall tax efficiently' on YouTube before they call anyone. These searches exist, they have low competition, and they surface the advisor who shows up as someone who understands the specific situation.",
            },
            {
                'question': 'How does YouTube complement our existing referral network?',
                'answer': "YouTube does not replace referrals—it handles a different acquisition pathway. Referrals close faster because trust transfers from the referrer. YouTube builds the same trust with people outside your network who would never receive a referral. Over time, YouTube becomes the asset that makes the firm discoverable to qualified prospects who have no personal connection to your existing clients.",
            },
        ],
        'commonMistakes': [
            {
                'title': 'Producing generic personal finance content instead of advisor-selection content',
                'description': "The majority of financial advisor YouTube channels produce educational content: how Roth IRAs work, what a 60/40 portfolio is, how compound interest compounds. This content attracts financial literacy seekers, not people looking to hire an advisor. The prospect who is close to hiring searches 'how to find a financial advisor for business owners', not 'what is dollar-cost averaging'.",
            },
            {
                'title': 'Not addressing the fee structure clearly',
                'description': "Prospects evaluating advisors have one consistent anxiety: cost and compensation structure. A video that explains your fee model directly—fee-only, AUM-based, retainer—and explains what that means for the client relationship converts significantly better than a video that avoids the subject. Transparency on fees is a trust signal, not a liability.",
            },
            {
                'title': 'Not differentiating by client type',
                'description': "A financial advisor who produces videos for 'anyone who wants financial advice' competes with every financial influencer on YouTube. An advisor whose videos address 'business owners approaching exit' or 'physicians in their first attending year' ranks for specific searches and attracts pre-qualified prospects who immediately see their situation reflected in the content.",
            },
        ],
    },
    'law-firms': {
        'topicExamples': [
            'do I need a business attorney for my LLC',
            'how to find a startup lawyer',
            'employment attorney for wrongful termination',
            'immigration lawyer consultation what to expect',
            'business contract lawyer vs DIY templates',
            'IP attorney for software startups cost',
            'when to hire a corporate attorney vs handling in-house',
        ],
        'industryFaqs': [
            {
                'question': "Does YouTube work for law firms that can't advertise specific outcomes?",
                'answer': "Yes. The most effective legal YouTube content explains the landscape of a legal situation without promising specific outcomes. A video titled 'What to expect when dealing with a commercial lease dispute' can rank, build trust, and drive consultation bookings without making any outcome representation. The viewer's need is understanding their situation—the video can meet that need within professional constraints.",
            },
            {
                'question': 'What practice areas work best on YouTube?',
                'answer': "Practice areas where clients self-identify with a problem and search before they call work best: employment, business/commercial, immigration, intellectual property, real estate transactions, startup law. Litigation-heavy criminal defense also has an audience. Practice areas with more institutional clients and less individual search behavior (M&A at scale, complex regulatory work) benefit less directly.",
            },
            {
                'question': "How do we handle videos where the legal answer is 'it depends'?",
                'answer': "Address the conditions under which it depends directly. 'It depends on whether your employment contract includes an arbitration clause and what state you're in' is more useful than a non-answer. Explaining the relevant variables positions the firm as knowledgeable and moves the viewer toward booking a consultation to apply those variables to their specific situation.",
            },
        ],
        'commonMistakes': [
            {
                'title': "Producing 'know your rights' content instead of conversion content",
                'description': "Informational legal content attracts viewers who want free information. 'Know your rights in a landlord dispute' gets watched by someone who wants to handle it themselves. 'Do you need a real estate attorney for a commercial lease' gets watched by someone deciding whether to hire one. The second type is acquisition content. The first is not.",
            },
            {
                'title': 'Being too cautious to say anything specific',
                'description': "Law firms often produce such hedged, qualified content that no useful signal comes through. A prospect watching a 10-minute video that says nothing definite leaves without any reason to reach out. The fear of saying something that could be construed as legal advice often produces content so vague it drives no action. Educational specificity builds trust. Vagueness loses the prospect.",
            },
            {
                'title': 'Not structuring videos around consultation-readiness',
                'description': "Every law firm video should end with a specific reason to book a consultation and a single CTA. A common failure mode is videos that provide information without a bridge to the next step. That bridge—'if you're dealing with this situation and you want to understand how it applies to your specific circumstances, book a consultation here'—should end every video.",
            },
        ],
    },
    'real-estate': {
        'topicExamples': [
            'how to choose a real estate agent for first-time buyers',
            'realtor vs real estate agent difference explained',
            'commercial real estate broker for office lease',
            'best neighborhoods for young families [city]',
            'how to sell a house without an agent pros and cons',
            'real estate agent commission negotiation tips',
            "buyer's agent vs listing agent what's the difference",
        ],
        'industryFaqs': [
            {
                'question': 'Is YouTube effective for real estate agents outside major markets?',
                'answer': "Often more effective. Smaller markets have less competition in YouTube search, which means a real estate agent in a mid-size market can rank for 'best realtor in [city]' much faster than an agent in Manhattan or Los Angeles. Local market search videos—neighborhood guides, market condition updates, local buyer tips—rank quickly and attract highly relevant local prospects.",
            },
            {
                'question': 'Should we target buyers, sellers, or both?',
                'answer': "Target the client type with the higher LTV for your business model, or the one currently underserved in your local YouTube market. Buyer-side content often performs well because first-time buyers are especially research-intensive. Seller content ('how to choose a listing agent', 'what to look for when evaluating realtors') attracts higher-value transactions in most markets.",
            },
            {
                'question': 'How do we compete with real estate content creators who have massive channels?',
                'answer': "Large real estate YouTube channels typically produce national or category-level content. They do not rank for 'best real estate agent in [your city]' or 'buying a duplex in [your neighborhood]'. Local specificity is the competitive advantage. A 5,000-subscriber local agent will outrank a 500,000-subscriber national channel for local queries.",
            },
        ],
        'commonMistakes': [
            {
                'title': 'Producing property listing tours instead of buyer and seller research content',
                'description': "Property listing videos serve existing marketing goals, not YouTube search acquisition. No one searches 'video tour of 123 Main Street' on YouTube. The searches that drive new client acquisition are 'how to choose a real estate agent', 'what to expect when buying a home', and 'is now a good time to sell in [city]'. These are research queries with sustained search volume. Listing tours are not.",
            },
            {
                'title': 'Skipping the advisor-selection angle',
                'description': "Most real estate YouTube channels produce market content: price trends, neighborhood overviews, interest rate commentary. Almost none produce content targeting the moment a client decides they need an agent. A video titled 'How to choose a real estate agent and what questions to ask' captures a buyer at their highest-intent moment, before they contact anyone else.",
            },
            {
                'title': 'Not including local market specificity in titles',
                'description': "A video titled 'How to buy your first home' competes with thousands of national real estate videos. A video titled 'How to buy your first home in Austin, Texas in 2025' competes with very few. Localising the title, even partially, routes local search volume to your video instead of national content farms.",
            },
        ],
    },
    'marketing-agencies': {
        'topicExamples': [
            'best content marketing agency for SaaS',
            'SEO agency vs in-house SEO comparison',
            'how to evaluate a paid media agency',
            'performance marketing agency vs brand agency',
            'content agency pricing models explained',
            'how to vet a marketing agency before signing',
            'digital marketing agency for B2B companies',
        ],
        'industryFaqs': [
            {
                'question': "We do marketing for others. Won't it look bad if our own marketing is low volume?",
                'answer': "It can look inconsistent, yes—which is why agencies that build a YouTube presence often see it accelerate trust more than other businesses. Prospects evaluating a marketing agency and finding them visible and well-ranked on YouTube are seeing evidence of what the agency claims to deliver. It's one of the cleaner proof points available to an agency.",
            },
            {
                'question': 'Should our videos feature our team members or use voiceover?',
                'answer': "Both work. Agency videos featuring a named team member or strategist often build stronger personal credibility, particularly for smaller agencies where the founder is a key part of the value proposition. Voiceover-only videos work well for agencies where the brand is the value, not individual practitioners. In both cases, the content quality matters more than the format.",
            },
            {
                'question': 'Our services evolve rapidly. What if our video content becomes outdated?',
                'answer': "Produce videos around durable buyer questions—how to evaluate an agency, what to look for in a content partner, how pricing models compare—rather than trend-specific content. These questions remain stable while tactics shift. A video on 'how to choose a content marketing agency' published in 2024 will still surface for that search in 2026.",
            },
        ],
        'commonMistakes': [
            {
                'title': 'Confusing content marketing with content for marketing',
                'description': "Marketing agencies make a consistent mistake on YouTube: they produce the kind of content they understand (creative, brand storytelling, trend analysis) rather than the content their prospects are searching for (agency evaluation guides, service comparison videos, ROI case study breakdowns). The agency's internal content instincts are optimised for brand reach, not search acquisition.",
            },
            {
                'title': 'Not niching the YouTube channel by client type',
                'description': "A broad 'digital marketing tips' channel owned by an agency attracts an audience of marketers, not prospective clients. The acquisition asset is a channel focused on a specific client type: 'YouTube acquisition strategy for B2B SaaS', or 'content marketing for financial services firms'. This focus signals to the exact right prospect that this agency understands their world.",
            },
            {
                'title': 'Using YouTube views as the success metric',
                'description': "Agency YouTube channels tend to measure success the same way they would a client campaign: by impressions and engagement. For acquisition, the only metric that matters is qualified leads booked for discovery calls. A video with 400 views that produces three qualified leads is more valuable than one with 4,000 views that produces none. The optimisation goal is conversion, not reach.",
            },
        ],
    },
    'software-companies': {
        'topicExamples': [
            'best software for [specific use case] comparison',
            'enterprise software implementation what to expect',
            'on-premise vs cloud software for mid-market companies',
            'how to evaluate enterprise software vendors',
            'software vendor selection checklist',
            'legacy system migration software options',
            'best workflow automation software for operations teams',
        ],
        'industryFaqs': [
            {
                'question': 'We have long enterprise sales cycles. Is YouTube too early-funnel for us?',
                'answer': "For enterprise software, YouTube is most valuable in the late-research phase—when procurement or IT leadership is narrowing the vendor list. This phase happens months before the formal RFP and is often invisible to sellers. A software company with strong YouTube presence in category search results influences the shortlist before any sales contact is made. This is early-to-mid funnel, not top-of-funnel.",
            },
            {
                'question': "What if our software category isn't widely searched on YouTube?",
                'answer': "Search volume for specific software categories is often underestimated. Buyers research software categories they don't know the name of through problem-based searches: 'how to automate invoice processing', 'software for tracking contractor compliance'. These searches have intent even when the searcher doesn't yet know the software category name. Building content around the problem, not the category label, captures this volume.",
            },
            {
                'question': 'Does it matter that enterprise buyers use YouTube at work?',
                'answer': "Enterprise buyers watch category research and comparison videos on their own time—often before raising the topic with a committee. The decision to add a vendor to the evaluation list is often made personally before it becomes a group discussion. YouTube influences that individual-research phase, which then shapes the formal group process.",
            },
        ],
        'commonMistakes': [
            {
                'title': 'Producing feature announcement and product update videos',
                'description': "Software companies default to producing product news: new feature releases, version updates, integration announcements. These videos are useful for existing customers and irrelevant to prospects. A prospect researching whether to evaluate your category doesn't know or care about your feature roadmap. They need to see that your solution addresses their specific operational problem before they'll engage with feature-level content.",
            },
            {
                'title': "Skipping the 'vs competitors' angle",
                'description': "Enterprise software buyers almost always evaluate multiple vendors. A video comparing your solution against two or three competitors—done honestly—is the most useful resource for a buyer who is already in evaluation mode. Companies that avoid comparison content cede that positioning to review sites or competitors who are willing to make the comparison themselves.",
            },
            {
                'title': 'Making the sales team the star instead of solving buyer problems',
                'description': "Software company videos often feature account executives or sales engineers presenting the product. This creates a video that feels like a sales call, which causes instant disengagement. Prospects trust third-party-style analysis and problem-first framing. The video that wins says 'here's how to solve this problem' and happens to feature your software as the answer—not 'here's why our software is great'.",
            },
        ],
    },
    'fintech-companies': {
        'topicExamples': [
            'best fintech app for small business banking',
            'traditional bank vs fintech for business accounts',
            'payment processing software comparison for e-commerce',
            'B2B payment platform for international transfers',
            'fintech tools for accountants and bookkeepers',
            'best expense management software for startups',
            'invoice financing vs traditional business loan',
        ],
        'industryFaqs': [
            {
                'question': 'Financial products are regulated. How do we produce YouTube content within compliance constraints?',
                'answer': "The highest-converting fintech YouTube content is explanatory: explaining how financial products work, how to compare options in a category, and how to evaluate a provider for a specific use case. This type of content typically falls within educational commentary rather than regulated advice. Your compliance team will have clear guidance on what constitutes a regulated claim versus explanation.",
            },
            {
                'question': 'Our product is complex. How do we explain it in a video without oversimplifying?',
                'answer': "Target the specific use case, not the whole product. A video on 'how international payment platforms handle multi-currency reconciliation' for your target user is more effective than a comprehensive product overview. The buyer watching that video already understands the domain—you don't need to teach them the basics, you need to show that your product handles the specifics they care about.",
            },
            {
                'question': 'What types of fintech buyers are most likely to research on YouTube?',
                'answer': "Small business owners and finance team leads (controllers, CFOs of smaller companies) research financial tools on YouTube more than enterprise procurement teams do. If your product addresses the SMB to mid-market segment, YouTube search intent is particularly strong. Enterprise fintech is more likely to reach buyers through conference presence and analyst relations.",
            },
        ],
        'commonMistakes': [
            {
                'title': 'Producing financial literacy content instead of product evaluation content',
                'description': "Fintech companies often produce videos explaining financial concepts their product is adjacent to—how invoice financing works, what open banking is, how cross-border payments function. This content builds brand awareness with the wrong audience: people learning about the topic, not people evaluating products in the category. Acquisition content targets people who already understand the concept and are deciding which provider to use.",
            },
            {
                'title': 'Not addressing the trust gap directly',
                'description': "The primary objection to any fintech product is trust with financial data and money. Fintech YouTube content that ignores this loses to traditional banks who are implicitly trusted by default. Videos that address security architecture, regulatory status, and how funds are protected—directly and early—outperform product feature videos in conversion for this reason.",
            },
            {
                'title': 'Targeting the consumer segment when the product is B2B',
                'description': "Fintech YouTube content defaults to consumer personal finance language even when the product is B2B. A business banking or payments tool marketed with language about 'managing your money better' will surface next to personal finance content and attract the wrong viewer. B2B fintech content should use operator language: accounts payable, cash flow management, treasury operations, vendor payment automation.",
            },
        ],
    },
    'hr-software': {
        'topicExamples': [
            'best HRIS for companies under 500 employees',
            'HR software comparison for mid-market companies',
            'payroll software vs HRIS all-in-one platform',
            'how to choose an ATS for high-volume recruiting',
            'best performance management software for remote teams',
            'HR software implementation what to expect',
            'Workday vs BambooHR comparison for growing companies',
        ],
        'industryFaqs': [
            {
                'question': 'HR tech decisions involve multiple stakeholders. Does YouTube reach all of them?',
                'answer': "YouTube typically reaches the internal champion—the HR director or People Ops lead who initiates the evaluation—before the decision broadens to a committee. Influencing the champion's shortlist at the research stage shapes the entire vendor selection process. By the time CFO or legal reviews, the champion has already formed strong opinions that YouTube content helped build.",
            },
            {
                'question': "How do HR software companies handle the 'we already have a legacy HRIS' objection?",
                'answer': "Make a video specifically targeting it. 'When to replace your HRIS' and 'signs your HR software is holding you back' are searches that HR leaders make when they're beginning to question their current system. A video that directly addresses the migration anxiety—implementation timeline, data transfer, team adoption—converts prospects who are at the most valuable stage of awareness.",
            },
            {
                'question': 'Our product serves both SMB and enterprise. Should we produce content for both?',
                'answer': "Produce separate content for each, with different targeting. SMB HR buyers make different searches than enterprise buyers, have different concerns (price, ease of setup), and evaluate on different criteria. An HR director at a 50-person company searching for HRIS options is not looking for the same solution as an HR VP at a 5,000-person company.",
            },
        ],
        'commonMistakes': [
            {
                'title': 'Producing HR thought leadership instead of buyer decision content',
                'description': "HR software companies fill their YouTube channels with webinar recordings, HR trend commentary, and compliance update videos. This attracts HR practitioners interested in professional development, not buyers evaluating platforms. A buyer comparing HRIS options searches 'BambooHR vs Rippling for 200-person company', not 'future of HR in the hybrid workplace'. Content must match the search, not the brand's preferred topics.",
            },
            {
                'title': 'Ignoring the integration and implementation question',
                'description': "The second-biggest barrier to HR software purchases (after price) is implementation anxiety. Companies worry about data migration, team adoption, payroll continuity during transition. Videos that directly address 'what does HRIS implementation actually look like' and 'how long does it take to migrate from [competitor] to your platform' address the objection that is killing more sales conversations than any feature gap.",
            },
            {
                'title': 'Showing feature demos before showing problem understanding',
                'description': "HR software demo videos assume the viewer already believes your solution can solve their problem. Most viewers are still in problem-definition mode. A video that opens with 'if your HR team is still using spreadsheets for performance reviews, here's what that costs you' converts better than one that opens with a product walkthrough. Problem first, solution second.",
            },
        ],
    },
    'edtech-companies': {
        'topicExamples': [
            'best online learning platform for corporate training',
            'LMS comparison for mid-market companies',
            'e-learning vs instructor-led training ROI comparison',
            'best platform for selling online courses',
            'how to choose an LMS for a growing company',
            'Teachable vs Thinkific for course creators',
            'corporate training platform for remote teams',
        ],
        'industryFaqs': [
            {
                'question': 'EdTech is a crowded market. Can YouTube still work for a newer platform?',
                'answer': "New platforms can rank faster than established ones by targeting specific use-case queries that larger platforms have not fully covered. 'Best LMS for compliance training in financial services' is a far more accessible target than 'best LMS'. Use case specificity, vertical focus, or feature-specific differentiation is what carves out a rankable niche within a crowded category.",
            },
            {
                'question': 'Should we target the training manager or the individual learner on YouTube?',
                'answer': "For B2B platforms, target the training manager or L&D director—the buyer. They search for platform evaluation and ROI content. For platforms where individuals can purchase access directly (like online course marketplaces), targeting the individual learner's topic searches is more relevant. The content strategy follows the buyer, not just the end user.",
            },
            {
                'question': 'How do we show platform value in a video without a live demo environment?',
                'answer': "Screen recordings and walkthroughs of the platform experience work well for this. Show the outcome of using the platform—a learner completing a module, a manager pulling a completion report—rather than a product walkthrough. The goal is to show the result the buyer cares about, not the interface they'll navigate.",
            },
        ],
        'commonMistakes': [
            {
                'title': 'Producing content about e-learning trends instead of platform evaluation content',
                'description': "EdTech channels default to trend content: the future of corporate learning, microlearning vs long-form, AI in L&D. This attracts L&D professionals consuming industry content, not evaluating platforms. A training manager who is evaluating an LMS searches 'LMS comparison for manufacturing compliance training', not 'trends in corporate learning 2025'. Trend content does not convert buyers.",
            },
            {
                'title': 'Not differentiating by company size or vertical',
                'description': "A video about 'the best LMS' competes in a saturated search. A video about 'the best LMS for construction companies with 200+ field workers' competes with almost no one and converts at a much higher rate. EdTech platforms that produce vertical- or size-specific content rank faster and attract buyers whose situation matches the platform's actual sweet spot.",
            },
            {
                'title': 'Confusing course platform content with platform marketing content',
                'description': "EdTech companies sometimes produce course-style videos on their topic domain—leadership, skills development, productivity—rather than platform evaluation content. This educates the market at the expense of acquiring customers. The production investment goes into content that benefits learners in general, not into content that converts buyers into platform trials.",
            },
        ],
    },
    'cybersecurity-companies': {
        'topicExamples': [
            'best endpoint security software for mid-market companies',
            'cybersecurity vendor evaluation checklist',
            'SIEM comparison for growing companies',
            'managed security service provider vs in-house SOC',
            'how to evaluate a penetration testing firm',
            'zero trust architecture vendors compared',
            'cloud security platform for SaaS companies',
        ],
        'industryFaqs': [
            {
                'question': "Security buyers say they find vendors through peer referrals, not YouTube. Is that still true?",
                'answer': "Peer referrals influence the final decision, but YouTube shapes the initial awareness and shortlist. A CISO who hears a peer mention a vendor at a conference will then search that vendor on YouTube before engaging. YouTube is also where security leaders research categories before they know which vendors to ask peers about. Referrals close; YouTube opens the door.",
            },
            {
                'question': "Our work involves sensitive details we can't discuss publicly. What can we actually show?",
                'answer': "Framework and approach videos perform well for security companies. 'How to evaluate a penetration testing firm', 'what a mature incident response program looks like', 'what CISOs get wrong about vendor selection' are all research searches that security buyers make and that do not require any sensitive client information. Demonstrating the quality of your thinking is the goal.",
            },
            {
                'question': 'How do we produce content for a CISO audience without being too technical or too vague?',
                'answer': "Target the specific decision the CISO is making, not the technology. A CISO searching YouTube is typically evaluating a category, comparing approaches, or trying to understand a problem they need to brief their board on. Content that matches the language of that decision—'how to build the business case for a SIEM investment'—outperforms both technical deep-dives and broad security marketing.",
            },
        ],
        'commonMistakes': [
            {
                'title': 'Producing threat intelligence content instead of vendor evaluation content',
                'description': "Cybersecurity YouTube channels are heavy with threat analysis, malware breakdowns, and attack technique explanations. This content attracts security practitioners doing their jobs, not buyers evaluating vendors. A procurement lead or CISO deciding which security vendor to engage is not searching for threat intelligence. They are searching for vendor comparison, evaluation criteria, and what good implementation looks like.",
            },
            {
                'title': 'Leading with fear instead of solving the evaluation problem',
                'description': "Security marketing defaults to fear: breach statistics, ransomware headlines, regulatory fines. Buyers are already aware of the risk—that's why they're evaluating vendors. Content that converts says 'here's how to choose the right [security category] vendor for a company your size' rather than 'here's why a breach will ruin your business'. The buyer's anxiety is already present. Address the decision, not the threat.",
            },
            {
                'title': 'Not producing comparison content because it names competitors',
                'description': "Security vendors avoid naming competitors in video content for legal and political reasons. This cedes the comparison conversation to third-party reviewers and analyst reports. A vendor that produces honest, well-researched comparison content—explaining the relevant dimensions to evaluate in the category, with a clear explanation of where they fit—builds more trust than one that avoids the question.",
            },
        ],
    },
    'accountants': {
        'topicExamples': [
            'accountant vs bookkeeper which do I need',
            'how to find a small business accountant',
            'CPA for startup companies what to look for',
            'tax accountant for self-employed freelancers',
            'accounting software vs hiring an accountant',
            'fractional CFO vs full-time CFO for startups',
            'accountant for real estate investors',
        ],
        'industryFaqs': [
            {
                'question': 'Most accounting clients come through referrals. Can YouTube build a parallel pipeline?',
                'answer': "Yes, and it fills the gap that referrals leave—new-to-market prospects who haven't yet built the network that generates referrals, or business owners who prefer to research independently before asking anyone for a recommendation. YouTube typically develops over 6 to 12 months into a consistent 2 to 5 qualified inbound contacts per month for a well-executed channel, alongside the referral flow.",
            },
            {
                'question': 'What topics can accounting firms safely discuss without giving away advice?',
                'answer': "'What does working with an accountant for [business type] actually look like', 'how accounting fees work and what questions to ask', 'when to move from a generalist accountant to a specialist'—these topics address the advisory relationship, not specific tax advice. They convert because the viewer is evaluating whether to hire you, not looking for free answers.",
            },
            {
                'question': 'We serve a local market. Does YouTube work for local accounting firms?',
                'answer': "Local firms often see the fastest results because local YouTube competition is minimal. A video titled 'small business accountant in [city]: what to look for' can rank within weeks for a local search. Geographic specificity dramatically reduces the competitive field and routes local buyer searches directly to your content.",
            },
        ],
        'commonMistakes': [
            {
                'title': 'Producing tax tips videos instead of client acquisition content',
                'description': "Accounting firms default to producing tax tips, deadline reminders, and 'what you can deduct' content. This attracts people looking for free tax information—not people deciding to hire an accountant. The person who watches a tax tips video is solving their own tax problem. The person who watches 'how to find the right accountant for your growing business' is one step away from becoming a client.",
            },
            {
                'title': 'Not targeting a specific type of client',
                'description': "Generic 'accounting services' content competes broadly and converts poorly. A video targeting 'accountants for e-commerce businesses' or 'CPA for SaaS startups' ranks for specific searches and attracts exactly the type of business the firm wants as a client. Specificity is the mechanism by which accounting firms differentiate on YouTube in a sea of generalist content.",
            },
            {
                'title': 'Not explaining what an initial engagement looks like',
                'description': "One of the highest-intent searches for accounting firms is 'what happens when I hire an accountant'. These prospects are past the 'do I need one' question and into 'what does the onboarding process look like'. A video that explains the first 30 days of working with your firm—what you gather, how you work together, what they can expect—converts at a significantly higher rate than a services overview video.",
            },
        ],
    },
    'insurance-agents': {
        'topicExamples': [
            'independent insurance agent vs captive agent explained',
            'how to compare business insurance quotes',
            'business liability insurance for small businesses',
            'life insurance for business owners what to know',
            'how much business insurance do I need',
            'cyber insurance for small business is it worth it',
            'commercial insurance agent how to choose one',
        ],
        'industryFaqs': [
            {
                'question': 'Insurance is highly regulated. What can we actually say on YouTube?',
                'answer': "Educational and explanatory content about insurance concepts, how to evaluate coverage, and what different policy types cover is generally within what agents can say. The most effective insurance YouTube content describes coverage scenarios, explains what questions buyers should be asking their agents, and helps viewers understand how to evaluate options—without making specific promises about coverage outcomes.",
            },
            {
                'question': 'How do we compete with the large insurance brands that dominate YouTube?',
                'answer': "Large insurance brands produce brand-awareness content, not advisor-selection content. Nobody searches 'State Farm vs Progressive for commercial property insurance in a small family business' and finds the answer from those brands. Local and specialized agents who produce specific, low-competition search content operate in a completely different slice of YouTube that national brands don't compete in.",
            },
            {
                'question': 'What types of insurance clients are most likely to search YouTube?',
                'answer': "Small business owners evaluating commercial coverage are the most active YouTube researchers in insurance. They have enough complexity to want to understand their options but lack the institutional buying apparatus of larger companies. Cyber insurance, professional liability, and business owner policies are categories where small business searches are high and specialized agent content is scarce.",
            },
        ],
        'commonMistakes': [
            {
                'title': 'Producing general insurance literacy content instead of advisor-selection content',
                'description': "Insurance agent channels fill with 'what is general liability insurance' and 'term vs whole life explained' content. These videos attract people who want to understand insurance in general, not people who have decided to buy and are choosing an agent. Acquisition content targets the decision moment: 'how to choose a commercial insurance agent' and 'what to look for when comparing business insurance brokers'.",
            },
            {
                'title': 'Ignoring the local market opportunity',
                'description': "National insurance content is competitive. Local insurance content almost never is. An agent who produces 'business insurance in [city]: what small business owners need to know' will rank locally for that search with minimal competition. Combining geographic targeting with a business type ('restaurant insurance in Chicago', 'construction contractor insurance in Texas') produces videos that rank quickly and attract highly relevant prospects.",
            },
            {
                'title': "Not using YouTube to address the 'can I trust this agent' question",
                'description': "The primary buyer hesitation with insurance agents is credibility and trustworthiness. Content that directly signals expertise—explaining complex coverage questions clearly, addressing common policy gaps, walking through a coverage review process—builds that trust more effectively than testimonials or brand imagery. YouTube is the medium where a viewer can evaluate an agent's knowledge before making contact.",
            },
        ],
    },
    'mortgage-brokers': {
        'topicExamples': [
            'mortgage broker vs bank direct which is better',
            'how to find a good mortgage broker',
            'first-time buyer mortgage what to expect',
            'mortgage pre-approval process explained',
            'jumbo loan mortgage broker explained',
            'self-employed mortgage how it works',
            'refinancing with a mortgage broker pros and cons',
        ],
        'industryFaqs': [
            {
                'question': 'The mortgage market is highly rate-sensitive. Does our YouTube content go stale quickly?',
                'answer': "Content about the process, broker selection, and mortgage types stays evergreen regardless of rate environment. Rate commentary has a short shelf life. A video on 'how to choose a mortgage broker' published two years ago will still rank and convert today. Rate-specific content can be produced episodically but should not be the primary acquisition strategy.",
            },
            {
                'question': 'Most first-time buyers are referred by real estate agents. Do we still need YouTube?',
                'answer': "Referral dependence is the problem YouTube solves. First-time buyers who start their research before they engage an agent often search YouTube first to understand the process. Being found at that earliest stage—before the real estate agent relationship is established—creates an independent client pipeline that doesn't flow through a referral network you don't control.",
            },
            {
                'question': 'Can YouTube work for mortgage brokers who specialize in specific loan types?',
                'answer': "Specialty creates a significant YouTube advantage. A broker who specializes in self-employed mortgages produces a video on 'how to get a mortgage when self-employed' and ranks for a specific, high-intent search with virtually no competition from other mortgage brokers. Specialty makes YouTube adoption faster, targeting more precise, and prospects more pre-qualified.",
            },
        ],
        'commonMistakes': [
            {
                'title': 'Producing rate commentary instead of buyer-decision content',
                'description': "Mortgage broker YouTube channels are disproportionately filled with rate updates: 'this week's mortgage rates', 'Fed announcement analysis', 'where rates are headed in Q2'. This content attracts people tracking rates who are not close to a decision. It also ages instantly. The content that converts—'how to choose a mortgage broker for first-time buyers'—is searched consistently regardless of rate environment and attracts prospects actively looking for a broker.",
            },
            {
                'title': 'Not producing comparison content between direct lenders and brokers',
                'description': "One of the most common buyer research questions is 'mortgage broker vs going to my bank directly'. Many mortgage brokers avoid producing this comparison because they worry about overselling the broker advantage. In practice, a broker who makes this case clearly and honestly—addressing the real trade-offs—converts the search into a consultation more often than one who avoids the comparison.",
            },
            {
                'title': 'No geographic targeting in video titles',
                'description': "Mortgage broker searches are frequently local. 'Mortgage broker in [city]' and 'best mortgage broker [state]' are high-intent searches with limited video competition. Brokers who produce geographically labeled content ('mortgage broker for first-time buyers in Seattle') capture the local buyer segment without competing against national mortgage content sites.",
            },
        ],
    },
    'recruiting-firms': {
        'topicExamples': [
            'executive recruiting firm vs in-house recruiting',
            'how to choose a recruiting agency for tech hiring',
            'retained vs contingency recruiting explained',
            'staffing agency vs recruiting firm difference',
            'how headhunters find candidates for hard-to-fill roles',
            'technical recruiting agency for startup engineering teams',
            'what to expect when working with a recruiter',
        ],
        'industryFaqs': [
            {
                'question': 'Recruiting is relationship-driven. Can YouTube build the kind of trust needed to win a search?',
                'answer': "YouTube is where buyers form initial opinions before they seek a relationship. A hiring manager who sees your firm clearly and consistently explain their specific talent market—and demonstrate that you understand the nuances of what makes a senior hire in that domain—arrives at a first call already trusting your understanding of the space. The relationship then accelerates from an informed starting point, rather than from zero.",
            },
            {
                'question': 'We place candidates, not just fill jobs. How do we position that on YouTube?',
                'answer': "Produce content that speaks to hiring managers and functional leaders who are frustrated with the quality of candidates they see from generic job boards. A video titled 'why technical recruiting is different and how to evaluate a specialized firm' addresses the exact concerns of a buyer who knows their last three recruiting vendor experiences have been disappointing. That video converts decision-makers, not just anyone looking for a recruiter.",
            },
            {
                'question': 'What practice areas work best for recruiting firm YouTube content?',
                'answer': "Executive search, technical recruiting, and specialized functional roles (finance leadership, legal, C-suite) work best because clients who need these placements do significant vendor research before engaging. Commodity staffing and high-volume temp placement have shorter evaluation cycles and are less search-driven. The more specialized the placement, the more research the buyer conducts—and the more YouTube benefits the firm.",
            },
        ],
        'commonMistakes': [
            {
                'title': 'Producing career advice content instead of client acquisition content',
                'description': "Recruiting firms default to producing career advice videos: resume tips, interview coaching, salary negotiation guides. These attract job seekers. Job seekers are not clients. The clients who pay recruiting fees are hiring managers and HR leaders. A channel full of candidate-facing content is actively wrong for firm acquisition. Client acquisition content addresses the hiring manager's problem: 'how to find a specialized recruiter for hard-to-fill roles in [domain]'.",
            },
            {
                'title': 'Not distinguishing retained from contingency search clearly',
                'description': "Hiring managers who do not regularly work with recruiting firms often do not understand the difference between retained and contingency search. A video that explains this distinction clearly—and helps a buyer understand which model fits their situation—positions the firm as an advisor before the sales conversation even starts. This is one of the highest-converting topics for recruiting firms that target senior search engagements.",
            },
            {
                'title': 'Generic content instead of vertical or function-specific focus',
                'description': "A recruiting firm that produces general content about hiring competes in a broad field. A firm that produces content specifically about 'hiring senior engineers at Series B startups' or 'recruiting finance leaders for private equity portfolio companies' ranks for specific searches and attracts buyers whose needs match exactly what the firm delivers.",
            },
        ],
    },
    'management-consultants': {
        'topicExamples': [
            'management consulting for operational efficiency',
            'how to hire a strategy consultant',
            'business transformation consultant what to expect',
            'McKinsey vs boutique consulting firm comparison',
            'operations consultant for manufacturing companies',
            'change management consultant for growing companies',
            'consulting firm RFP how to evaluate proposals',
        ],
        'industryFaqs': [
            {
                'question': 'Management consulting engagements often start through partner networks. Does YouTube reach beyond that?',
                'answer': "YouTube reaches the decision-maker before the network conversation. A COO who hears about your firm at an event will often research you on YouTube before engaging. More importantly, YouTube surfaces you to decision-makers who don't yet have a connection to your network—buyers evaluating a new category of consulting engagement they've never done before, who are researching how to find the right firm.",
            },
            {
                'question': 'Our engagements are highly customized. How do we represent that without overpromising?',
                'answer': "'How we think about [problem type]' videos are among the most effective for management consultants. They reveal your intellectual approach without making engagement-specific promises. A buyer watching a 12-minute video on how your firm approaches supply chain resilience projects leaves knowing whether your thinking resonates with their situation—which is the only signal they need to start a conversation.",
            },
            {
                'question': 'How do we position ourselves relative to the major consulting brands on YouTube?',
                'answer': "The major consulting brands produce thought leadership and report launches—content that reinforces category authority for an audience that already knows them. They don't produce 'how to choose the right strategy consultant for a $50M revenue company' content. That gap is where specialized boutique and independent consultants can dominate search results for the exact buyer who is evaluating them.",
            },
        ],
        'commonMistakes': [
            {
                'title': 'Publishing methodology white papers instead of buyer decision content',
                'description': "Management consultants naturally produce content around their frameworks and methodologies. This is intellectually rigorous but not what buyers search for. 'Our approach to operating model design' attracts consulting peers and academics. 'How to know when your company needs a strategy consultant' attracts buyers. The content has to start with the buyer's problem, not the consultant's answer.",
            },
            {
                'title': 'Requiring too much domain knowledge from the viewer upfront',
                'description': "Consulting video content often assumes the viewer is already familiar with consulting terminology, engagement structures, and typical outputs. A first-time buyer evaluating whether to engage a management consultant for the first time will disengage from jargon-heavy content. The video that wins is the one that starts from the buyer's situation and builds toward the solution at the buyer's pace.",
            },
            {
                'title': 'Producing case study content that is too abstract',
                'description': "Consulting case studies on YouTube often protect client identity to the point where the scenario becomes unrecognizable. 'A mid-sized manufacturing company in the Midwest improved operating margins by 12%' tells the viewer nothing. The more specific you can be about the situation—industry, company stage, the nature of the problem—the more the right buyer sees their situation reflected and decides to reach out.",
            },
        ],
    },
    'business-coaches': {
        'topicExamples': [
            'business coach for entrepreneurs worth it',
            'how to choose a business coach',
            'executive business coach vs management consultant',
            'business coaching for startup founders',
            'revenue growth coach for service businesses',
            'business coach vs business advisor difference',
            'group business coaching program review',
        ],
        'industryFaqs': [
            {
                'question': 'The business coaching market is crowded. How does YouTube cut through?',
                'answer': "Most business coaching content on YouTube is motivational or broadly educational—applicable to almost anyone, findable by almost anyone, compelling to almost no one who's close to buying. The specific coaching offer for a specific type of business at a specific stage wins YouTube, because the search that drove the click was specific. A video titled 'business coach for healthcare practice owners' outperforms one titled 'why every entrepreneur needs a coach'—not in views, but in conversions.",
            },
            {
                'question': 'Should I produce content as myself or as my business brand?',
                'answer': "For most business coaches, personal brand outperforms company brand in conversion. Business coaching is a personal relationship. A buyer evaluating coaches wants to assess the coach—their thinking, communication style, intellectual approach—before engaging. A branded company page with generic content doesn't provide the signal a prospective client needs to decide. Your face and voice, or at minimum your named perspective, should anchor the content.",
            },
            {
                'question': 'What outcome metrics can business coaches honestly promise in video content?',
                'answer': "Focus on outputs rather than outcomes. 'Clients typically close 20% more deals within 90 days' requires case-specific data to substantiate. 'We focus on three specific revenue leverage points that most service businesses leave on the table' is specific and honest without requiring outcome guarantees. Buyers are sophisticated enough to appreciate honest positioning over inflated promises.",
            },
        ],
        'commonMistakes': [
            {
                'title': 'Producing motivational content instead of evaluation content',
                'description': "Business coach channels are overwhelmingly motivational: mindset content, success frameworks, entrepreneur inspiration. These videos attract an audience that watches and feels good. They do not attract buyers evaluating whether to invest $5,000 to $30,000 in a coaching program. The buyer in evaluation mode is searching 'how to choose a business coach' or 'business coaching for [specific type of business]', not 'how to think like a successful entrepreneur'.",
            },
            {
                'title': 'Not addressing the ROI question directly',
                'description': "Buyers of business coaching are making a significant financial commitment. The most common objection is 'is this worth what it costs'. Coaches who avoid talking about ROI because it feels transactional leave this objection unaddressed and lose prospects to coaches who handle it directly. A video that walks through the typical return a client sees from the engagement—with honest framing—converts better than one that never addresses cost at all.",
            },
            {
                'title': 'Not specifying the ideal client profile on camera',
                'description': "Business coaching videos rarely say clearly who the coach works with and who they don't. A buyer watching a generic coaching video doesn't know if they qualify or whether this coach has worked with anyone like them. A video that opens with 'I work with service business owners doing $500K to $3M revenue who have hit a ceiling they can't scale through' immediately signals to the right buyer and filters out the wrong one.",
            },
        ],
    },
    'life-coaches': {
        'topicExamples': [
            'life coach vs therapist what is the difference',
            'is life coaching worth it review',
            'how to find a life coach for career transitions',
            'life coach for women in their 40s review',
            'best life coach for burnout and stress',
            'online life coaching programs compared',
            'what does a life coach actually do',
        ],
        'industryFaqs': [
            {
                'question': "Life coaching has a reputation for lack of credentialing. How do we handle this on YouTube?",
                'answer': "Address it directly and early. A video that explains what certifications mean, which are rigorous versus superficial, and what a buyer should look for when vetting a life coach will outperform any coach who avoids the question. The buyer already has this concern. Meeting it head-on is a trust signal, not a liability. This type of transparency is what separates credible coaches from the crowded field.",
            },
            {
                'question': 'Our approach is intuitive and hard to explain in a structured video. How do we handle this?',
                'answer': "Focus on the client transformation journey rather than your methodology. Show the before and after in concrete terms—what the client's situation was before and what changed—even without naming specific clients. A prospect who hears their own situation described accurately in your description of the 'before' state will naturally want to understand what the 'after' looks like and how you get there.",
            },
            {
                'question': "What's the difference between YouTube content that builds community versus content that converts?",
                'answer': "Community-building content is broad, relatable, and resonates with many people at a shallow level. Conversion content is specific, addresses the exact decision the buyer is wrestling with, and resonates deeply with a smaller group. For life coaches, the difference is: 'how to stop feeling stuck' (community) versus 'life coaching for professionals considering a career change after 40' (conversion). Both have value, but only conversion content drives discovery calls.",
            },
        ],
        'commonMistakes': [
            {
                'title': "Producing self-help content that competes with YouTube's entire wellness ecosystem",
                'description': "Life coach YouTube channels produce positive mindset content, morning routine guides, and stress management tips—identical to what every wellness creator, psychologist, and productivity influencer produces. This content does not rank for buying-intent queries. It competes in the most crowded content category on YouTube. The acquisition content for a life coach is narrow and specific: 'how to choose a life coach for [specific situation]'.",
            },
            {
                'title': "Not qualifying who the coach is for, and who they're not for",
                'description': "Life coach videos almost never say 'I don't work with people who [X]'. The instinct is to appeal broadly. The effect is that no specific prospect feels they are being spoken to. A coach who clearly states their ideal client type—career changers in their 30s, mothers returning to work, executives dealing with identity shifts at retirement—attracts people who recognize themselves and repels people who would have been a poor fit anyway.",
            },
            {
                'title': "Skipping the 'how do I know if I need a life coach' video",
                'description': "The highest intent search for life coaches is not 'best life coaches' but 'do I need a life coach' and 'is life coaching right for me'. These searches come from people on the edge of deciding to invest. A video that addresses this directly—explaining who benefits most and who would be better served elsewhere—converts at a dramatically higher rate than promotional videos about the coach's credentials or approach.",
            },
        ],
    },
    'professional-services': {
        'topicExamples': [
            'how to choose a professional services firm',
            'management consulting vs professional services firm',
            'outsourced CFO service for growing companies',
            'B2B professional services pricing models explained',
            'how to evaluate an outsourced service provider',
            'retained vs project-based professional services',
            'professional services firm for mid-market companies',
        ],
        'industryFaqs': [
            {
                'question': 'Professional services covers a wide range. How specific should our YouTube content be?',
                'answer': "As specific as possible within your actual service offering. 'Professional services' as a category is too broad to rank for. 'Outsourced accounting for Series A startups' or 'fractional operations for e-commerce brands' are the types of searches that produce ranked results and qualified prospects. Specificity in YouTube titles is what converts, even in categories where the firm's actual range is broad.",
            },
            {
                'question': 'Clients often buy from people they know. Does YouTube work in relationship-driven markets?',
                'answer': "YouTube builds the familiarity that normally comes from relationships—at scale and before initial contact. A buyer who has watched four videos from your firm arrives at a first conversation with the same level of comfort they would have after two coffee meetings. The medium substitutes for relationship development time with buyers you have not yet met.",
            },
            {
                'question': 'How do we show ROI of our services in video without case-specific data?',
                'answer': "Frame ROI through the cost of the alternative. A video that explains 'what it actually costs to hire a full-time CFO versus a fractional CFO at your stage' creates a clear financial comparison without requiring specific client outcomes. Category-level ROI analysis converts buyers who are evaluating the build vs buy decision before they evaluate which vendor to choose.",
            },
        ],
        'commonMistakes': [
            {
                'title': 'Leading with service descriptions instead of buyer problems',
                'description': "Professional services YouTube channels describe what they do—service scope, team credentials, process methodology. Buyers are not searching for service descriptions. They are searching for answers to problems: 'do I need an outsourced CFO', 'how to find a reliable operations partner', 'when should I outsource accounting vs keep it in-house'. Starting with the buyer's question is what surfaces the video in search.",
            },
            {
                'title': 'Producing capability content instead of evaluation content',
                'description': "Capability content says 'here's what we can do'. Evaluation content says 'here's how to decide if you need what we do and how to choose well'. Buyers at the research stage cannot yet evaluate capability—they're still assessing whether the engagement type is right for them. A video that guides this evaluation converts because it meets the buyer where they are, rather than pitching into an unformed decision.",
            },
            {
                'title': 'Not addressing the outsourcing trust gap',
                'description': "The primary objection to professional services outsourcing is loss of control: will they understand my business, can I trust an outside firm with this. A video that directly explains how the engagement model protects client interests, how communication works, and what a healthy client-provider relationship looks like addresses the objection before the sales call—making the conversation start in a completely different place.",
            },
        ],
    },
    'startup-founders': {
        'topicExamples': [
            'how to market a B2B startup without a budget',
            'founder-led sales vs hiring a sales team',
            'best acquisition channels for early stage SaaS',
            'startup growth strategies that do not rely on ads',
            'content marketing for startups with no audience',
            'YouTube for B2B startup lead generation',
            'how to get your first 100 B2B customers',
        ],
        'industryFaqs': [
            {
                'question': 'We are pre-revenue. Should we be on YouTube at all?',
                'answer': "Pre-revenue startups should prioritize direct sales and customer discovery over YouTube. YouTube compounds over 6 to 12 months—it is not an appropriate channel for immediate pipeline. The inflection point for YouTube investment is typically when the product is validated and the ICP is defined, because content targets specific buyer profiles. Vague ICP means vague targeting means no ranking means no acquisition.",
            },
            {
                'question': 'We have a small team. How much does YouTube content production take?',
                'answer': "With a voiceover-and-screen-recording format, a single video can be produced in 6 to 10 hours of total work, including research, scripting, recording, and editing. An external production partner like SellOnTube reduces internal time to brief review and approval. For most startups with defined ICPs, one video per month is sufficient to begin building a search-visible library.",
            },
            {
                'question': "We're not sure YouTube is right for us versus a different channel. How do we evaluate?",
                'answer': "Evaluate by ICP search behavior. Do your ideal customers research their problem category on YouTube before purchasing? Does a search for your category return results on YouTube? If yes to both, YouTube is worth testing. If your buyers purchase impulsively or do not research online before buying, YouTube's search-driven model is a poor fit regardless of volume.",
            },
        ],
        'commonMistakes': [
            {
                'title': 'Using YouTube before validating the product or ICP',
                'description': "Startup founders who start YouTube before they know who they're selling to produce content for nobody. YouTube rewards specificity. A channel targeting 'startups' broadly will not rank for anything useful. The minimum required for YouTube to work is a defined ICP and a validated problem statement. Without these, the content cannot be targeted, and unranked content generates no pipeline.",
            },
            {
                'title': 'Treating YouTube like a thought leadership channel',
                'description': "Founders who see other founders growing audiences on YouTube default to the same format: insights from their journey, growth frameworks, startup lessons. This content attracts other founders who want to learn, not prospective customers who want to buy. B2B acquisition YouTube is not about building a founder audience—it is about ranking for the searches your buyers make when they are close to a buying decision.",
            },
            {
                'title': 'Starting and stopping based on early view counts',
                'description': "YouTube for B2B acquisition is invisible for the first 4 to 6 months. A video published in month one may not rank for its target query until month four. Founders who measure success at the 60-day mark see nothing, conclude YouTube doesn't work, and stop. The compounding return from YouTube happens in months 6 to 18, not in the first weeks. Starting and stopping resets the clock every time.",
            },
        ],
    },
    'ecommerce': {
        'topicExamples': [
            'best e-commerce platform for high-volume brands',
            'Shopify vs WooCommerce for growing stores',
            'e-commerce fulfillment partner comparison',
            'B2B e-commerce platform for wholesale',
            'e-commerce marketing agency for DTC brands',
            'how to choose an e-commerce platform for international selling',
            'best headless commerce platform for enterprise',
        ],
        'industryFaqs': [
            {
                'question': 'E-commerce is consumer-focused. Does YouTube work for B2B e-commerce?',
                'answer': "B2B e-commerce buyers conduct extensive research before platform adoption. Procurement managers, operations leads, and digital commerce teams at wholesale and distribution companies search for platform comparisons and operational guides extensively. B2B e-commerce is often overlooked on YouTube, which means there is less competition for the searches that matter.",
            },
            {
                'question': 'We sell physical products. Does YouTube acquisition look different for us?',
                'answer': "Physical product e-commerce has two distinct YouTube use cases: acquisition videos targeting buyers researching which product category to buy from and which brands to trust (particularly for higher-consideration purchases), and vendor content targeting other businesses in the supply chain. For DTC brands in the $100+ purchase range, YouTube search drives qualified buyers at lower CAC than paid social in most categories.",
            },
            {
                'question': 'How do we handle the frequency of product changes in YouTube content?',
                'answer': "Produce content around the buying decision and product category, not specific SKUs. A video titled 'how to choose a [product category]' ages far more gracefully than a specific product review. Category and comparison content captures search volume for years, while SKU-specific videos become outdated with each product cycle.",
            },
        ],
        'commonMistakes': [
            {
                'title': 'Producing unboxing and product feature videos',
                'description': "E-commerce YouTube content defaults to product feature showcases and unboxing formats. These content types work for influencer marketing, not search acquisition. A prospective buyer searching 'best [product category] for [use case]' wants comparative analysis and decision guidance, not a product showcase. E-commerce acquisition content answers research queries with structure, not product marketing.",
            },
            {
                'title': 'Not targeting the category evaluation search',
                'description': "The highest-converting e-commerce acquisition search is not the product name—it is the category evaluation query: 'best [product type] for [specific use case] 2025'. These searches are made by buyers who have identified a need and are selecting a product. A video that ranks for this type of search with honest, specific comparison guidance converts buyers at a much higher rate than branded product content.",
            },
            {
                'title': 'Ignoring the B2B buyer for B2B e-commerce platforms',
                'description': "E-commerce platform videos target consumer entrepreneurs. Wholesale, distribution, and B2B procurement teams who need e-commerce functionality are searching YouTube with completely different language: B2B ordering portal, wholesale e-commerce, buyer account management, net terms integration. Platforms that serve this segment and produce content in the buyer's language have near-zero YouTube competition.",
            },
        ],
    },
    'healthcare-practices': {
        'topicExamples': [
            'how to choose a primary care doctor',
            'direct primary care vs traditional insurance model',
            'concierge medicine what does it cost',
            'functional medicine doctor what to expect',
            'telehealth vs in-person care comparison',
            'how to find a specialist for [condition] near me',
            'what to ask a new doctor before becoming a patient',
        ],
        'industryFaqs': [
            {
                'question': 'Healthcare has strict regulations on advertising. What can we say on YouTube?',
                'answer': "Educational content explaining care models, what patients should ask during evaluations, and how to choose a provider for their specific situation generally falls within acceptable educational territory rather than regulated advertising. The most effective healthcare YouTube content helps patients navigate their decision—explaining what concierge medicine is, what functional medicine addresses, how to evaluate a specialist—without making specific clinical outcome claims.",
            },
            {
                'question': 'Patients still choose doctors by proximity and insurance. Does YouTube reach them?',
                'answer': "YouTube influences the decision among nearby providers within the same insurance network. When a patient has several in-network options, YouTube content that explains the practice's approach, care model, and what to expect from working with that provider is what distinguishes one option from another. YouTube operates as a pre-visit trust builder among an already-qualified geographic pool.",
            },
            {
                'question': 'How do we handle patient privacy requirements in YouTube content?',
                'answer': "No patient information is required for effective healthcare YouTube content. The most effective format features a provider explaining their approach, care philosophy, and what patients commonly experience—without any patient identification. Hypothetical scenarios, anonymous clinical patterns, and general condition information are all useful without triggering privacy concerns.",
            },
        ],
        'commonMistakes': [
            {
                'title': 'Producing clinical education instead of patient decision content',
                'description': "Healthcare YouTube channels default to clinical education: how a condition works, what a procedure involves, how medication functions. This content attracts patients who already have a diagnosis and want to understand it. It does not attract patients deciding which provider to choose. Acquisition content targets the evaluation moment: 'how to choose a functional medicine doctor' or 'what to look for in a concierge primary care practice'.",
            },
            {
                'title': 'Not explaining the practice model and what makes it different',
                'description': "Most healthcare practice YouTube videos are indistinguishable from each other. They explain conditions and treatments without ever explaining what is different about this practice and why a patient would choose it over the five other options on the same insurance panel. A video that directly explains the practice's model—patient volume, appointment length, approach to chronic conditions, relationship continuity—converts by giving the patient a reason to choose specifically.",
            },
            {
                'title': 'Not targeting the emerging care model searches',
                'description': "Searches like 'direct primary care', 'concierge medicine', 'functional medicine doctor near me', and 'telehealth for chronic conditions' are high-intent queries with relatively low YouTube competition. Practices that operate under these models and produce content specifically for these searches capture patients who are actively researching the care model rather than just scrolling through their insurance directory.",
            },
        ],
    },
    'dental-practices': {
        'topicExamples': [
            'how to choose a dentist for adults with anxiety',
            'sedation dentistry what to expect',
            'cosmetic dentist vs general dentist',
            'dental implants vs dentures comparison',
            'finding a new dentist in [city] what to look for',
            'dental practice accepting new patients near me',
            'Invisalign vs braces for adults comparison',
        ],
        'industryFaqs': [
            {
                'question': "Most patients find dentists through their insurance network. Does YouTube reach them?",
                'answer': "YouTube influences which provider they choose within their available options, and reaches patients who are willing to pay out-of-pocket or switch to a preferred provider. For practices offering specialized services (sedation dentistry, implants, cosmetic dentistry), patients routinely research extensively before choosing regardless of insurance—often making a separate journey to find a specialist they trust.",
            },
            {
                'question': 'How do we produce compelling dental content without clinical imagery that might be off-putting?',
                'answer': "The most effective dental YouTube content focuses on patient experience and decision guidance, not clinical procedures. 'What to expect at your first visit to our practice', 'how we handle dental anxiety at our office', 'how to choose between dental implants and other tooth replacement options' are searches driven by patient decision needs. These videos are conversational, not clinical.",
            },
            {
                'question': 'We already have Google reviews. Does YouTube add anything?',
                'answer': "YouTube covers a different research behavior. Google reviews answer 'is this practice reliable'. YouTube content answers 'will I feel comfortable here' and 'does this practice understand my specific concern'. For patients with dental anxiety, a specific fear (needles, pain, gagging), or a high-cost treatment decision, YouTube content is how they evaluate whether to make contact. Reviews validate; YouTube converts.",
            },
        ],
        'commonMistakes': [
            {
                'title': 'Producing procedure explanation videos instead of patient decision content',
                'description': "Dental YouTube channels default to explaining procedures: how a root canal works, what Invisalign involves, the tooth implant process. These videos serve patients who have already committed to a treatment. They do not convert patients deciding which dentist to choose. Acquisition videos answer the pre-treatment decision: 'how to find a dentist who handles anxiety', 'what to look for in a cosmetic dentist', 'questions to ask before agreeing to dental implants'.",
            },
            {
                'title': 'Not targeting the new-to-area patient search',
                'description': "One of the highest-converting searches for dental practices is 'new dentist [city]' and 'dentist accepting new patients [area]'. Patients who have moved or lost their previous dentist are actively searching with high intent and low price sensitivity. A dental practice that appears prominently for this search with a video explaining what new patients can expect—including first visit, treatment philosophy, and how insurance is handled—captures this segment ahead of competitors who only appear in local directories.",
            },
            {
                'title': 'Ignoring the high-consideration procedure decision',
                'description': "Dental implants, Invisalign, full-mouth reconstruction, and cosmetic veneers all involve significant patient research before committing. These decisions often involve YouTube research before a consultation is even booked. A practice that appears in the comparison and evaluation searches for these procedures—'dental implants vs dentures which is right for me', 'how to choose between Invisalign and traditional braces'—captures pre-consultation leads for its highest-value services.",
            },
        ],
    },
    'subscription-businesses': {
        'topicExamples': [
            'subscription box service comparison review',
            'best SaaS subscription management software',
            'subscription e-commerce platform comparison',
            'recurring revenue business model explained',
            'how to reduce churn in subscription businesses',
            'subscription billing software for growing businesses',
            'subscription vs one-time purchase business model',
        ],
        'industryFaqs': [
            {
                'question': 'Subscription businesses often have free trials. Does YouTube work better with or without a trial offer?',
                'answer': "Both work, but content with a trial CTA performs better because it reduces friction in the conversion step. A viewer who finds your video through a search is in research mode. A trial offer converts them in the moment, before they continue comparing alternatives. If your model doesn't have a free trial, a money-back guarantee or low-commitment entry tier can serve a similar psychological function.",
            },
            {
                'question': 'We have high churn. Should we focus YouTube on acquisition or retention?',
                'answer': "YouTube is an acquisition channel, not a retention channel. If churn is high, the root cause is a product or onboarding problem that content cannot fix. Solve churn at the product level first. YouTube acquisition on top of high churn fills a leaky bucket faster, not slower—because the low acquisition cost relative to paid ads gives you more time to fix the retention problem without running out of pipeline.",
            },
            {
                'question': 'Subscription categories are often extremely competitive on YouTube. How do we differentiate?',
                'answer': "Vertical or use-case specificity is the mechanism. 'Best subscription billing software' is competitive. 'Best subscription billing software for SaaS companies billing in multiple currencies' is not. Narrow the use-case focus in titles and content until you find the intersection of real search demand and minimal competition. That intersection is where new channels can rank and win.",
            },
        ],
        'commonMistakes': [
            {
                'title': 'Producing brand content instead of category research content',
                'description': "Subscription businesses fill YouTube with company story videos, subscriber testimonials, and product highlight reels. These content types work for paid promotion and exist as brand assets. For organic YouTube acquisition, the relevant content targets the research queries buyers make when evaluating subscription products: 'best [category] subscription for [use case]', 'is [subscription type] worth it'. Brand content does not rank for those searches.",
            },
            {
                'title': 'Not addressing the cancellation concern directly',
                'description': "The primary buyer anxiety about subscription products is getting stuck—that canceling will be difficult or that they'll forget to cancel and keep paying. A video that addresses this directly—explaining exactly how cancellation works and what the commitment really is—removes a barrier that often prevents trial signups. Transparency about terms converts better than avoidance. The buyer's concern does not go away by not mentioning it.",
            },
            {
                'title': 'Promoting the subscription tier before establishing why the category matters',
                'description': "Subscription business videos often lead with pricing tiers, feature lists, and plan comparisons. These convert people who have already decided to subscribe. The larger audience is people who have not yet decided the category is worth paying for at all. A video that first makes the case for the category—why a subscription model serves this use case better than a one-time purchase—converts that undecided segment before presenting any tier options.",
            },
        ],
    },
    'marketplaces': {
        'topicExamples': [
            'marketplace platform comparison for [vertical]',
            'how to choose a B2B marketplace for [industry]',
            'marketplace vs direct purchasing comparison',
            'online marketplace for [specific product category]',
            'how marketplace platforms handle supplier vetting',
            'B2B procurement marketplace for manufacturing',
            'marketplace fees and commission structure explained',
        ],
        'industryFaqs': [
            {
                'question': 'Marketplaces have two sides: buyers and suppliers. Which side should we target on YouTube?',
                'answer': "Target the side with the longer decision cycle and higher switching cost. For most B2B marketplaces, that's the buyer side—the company committing procurement volume to a platform. Suppliers follow buyers. A marketplace that appears in buyer-side research searches acquires the demand side, which then attracts the supply side. Produce separate content for each audience type, but prioritize buyer acquisition first.",
            },
            {
                'question': "Network effects mean our marketplace value depends on liquidity. Does YouTube content help with the chicken-and-egg problem?",
                'answer': "YouTube addresses the awareness and credibility side of the chicken-and-egg problem, not the liquidity side directly. A buyer researching marketplaces who finds your platform in YouTube search arrives with a different perception than one who finds you through a cold ad. Content that explains how your platform achieves liquidity in your specific vertical—and why it's sufficient for a new buyer to trust—is what converts early-stage marketplace skeptics.",
            },
            {
                'question': 'How do we handle content about our marketplace fees, which are higher than alternatives?',
                'answer': "Address it directly with a total-cost framing. 'Our platform fee is X, and here's what you get that free alternatives don't provide' converts better than pricing evasion. Buyers who discover the fee in a sales conversation feel ambushed. Buyers who understand the fee and its rationale before contact arrive pre-justified. Transparency about pricing differentiates you from every competitor who avoids the question.",
            },
        ],
        'commonMistakes': [
            {
                'title': 'Producing marketplace content that talks to neither side specifically',
                'description': "Marketplace YouTube content often targets 'everyone who could use our platform', which means it resonates with no one. A B2B marketplace procurement video that speaks to a supply chain manager in specific language about their supplier vetting problem will outperform a generic 'discover our marketplace' video at every stage of the funnel. Pick one side per video. Speak to their specific situation. Link to content for the other side.",
            },
            {
                'title': "Skipping the 'why a marketplace vs direct purchasing' video",
                'description': "For marketplaces operating in categories where direct purchasing is the default, the first buyer objection is not 'which marketplace is best' but 'why use a marketplace at all'. A video that makes the case for the marketplace model in a specific vertical—addressing aggregation benefits, supplier vetting, contract standardization, payment terms—converts a much larger addressable audience than comparison content between two marketplaces.",
            },
            {
                'title': 'Not differentiating by vertical or use case',
                'description': "Horizontal marketplaces that try to cover all verticals on YouTube compete across too broad a field. Vertical-specific content—'B2B procurement marketplace for food and beverage manufacturers', 'raw materials marketplace for sustainable brands'—narrows the competition and attracts buyers who see their specific supply chain problem reflected in the content. Even a horizontal platform should produce vertical-specific content for its top five categories.",
            },
        ],
    },
}


def ts_string_list(items):
    parts = []
    for item in items:
        # Escape single quotes by using backslash
        escaped = item.replace("'", "\\'")
        parts.append(f"        '{escaped}'")
    return "[\n" + ",\n".join(parts) + ",\n      ]"


def ts_faq_list(faqs):
    parts = []
    for faq in faqs:
        q = faq['question'].replace("'", "\\'")
        a = faq['answer'].replace("'", "\\'")
        parts.append(
            f"        {{\n"
            f"          question: '{q}',\n"
            f"          answer: '{a}',\n"
            f"        }}"
        )
    return "[\n" + ",\n".join(parts) + ",\n      ]"


def ts_mistake_list(mistakes):
    parts = []
    for m in mistakes:
        t = m['title'].replace("'", "\\'")
        d = m['description'].replace("'", "\\'")
        parts.append(
            f"        {{\n"
            f"          title: '{t}',\n"
            f"          description: '{d}',\n"
            f"        }}"
        )
    return "[\n" + ",\n".join(parts) + ",\n      ]"


def build_insertion(slug):
    c = NICHE_CONTENT[slug]
    te = ts_string_list(c['topicExamples'])
    ifaqs = ts_faq_list(c['industryFaqs'])
    cm = ts_mistake_list(c['commonMistakes'])
    return (
        f"    topicExamples: {te},\n"
        f"    industryFaqs: {ifaqs},\n"
        f"    commonMistakes: {cm},\n"
    )


def main():
    niches_path = r"c:\Users\D E L L\Downloads\Claude Coded\SellonTube\src\data\niches.ts"

    with open(niches_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    # We'll track current slug by scanning for slug: 'xxx'
    # and insert before ctaHeading: lines
    slug_pattern = re.compile(r"^\s+slug:\s+'([^']+)'")
    cta_pattern = re.compile(r"^\s+ctaHeading:")

    current_slug = None
    result = []

    for line in lines:
        slug_match = slug_pattern.match(line)
        if slug_match:
            current_slug = slug_match.group(1)

        if cta_pattern.match(line) and current_slug and current_slug in NICHE_CONTENT:
            insertion = build_insertion(current_slug)
            result.append(insertion)
            current_slug = None  # reset after inserting

        result.append(line)

    with open(niches_path, 'w', encoding='utf-8') as f:
        f.writelines(result)

    print(f"Done. Processed niches.ts.")


if __name__ == '__main__':
    main()
