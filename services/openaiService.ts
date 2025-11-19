import OpenAI from "openai";
import { UserProfile, RecommendedQuest, Product, Content } from "../types";
import { KEYWORDS, EMOTIONS } from '../constants';

const API_KEY = process.env.API_KEY;

const MOCK_SHOPPING_DATA = {
  bannerMessage: "잠시 쉬어가도 괜찮아요. 당신을 위한 힐링 아이템을 모아봤어요.",
  products: [
    {
      name: "딥 슬립 필로우 미스트",
      category: "수면 케어",
      description: "잠들기 전 베개에 뿌리면 라벤더 향이 깊은 숙면을 도와줍니다.",
      price: "24,000원",
      imageUrl: "https://images.unsplash.com/photo-1541781777621-4018301a7041?auto=format&fit=crop&w=400&q=80"
    },
    {
      name: "천연 소이 캔들 (우드윅)",
      category: "아로마",
      description: "타닥타닥 나무 타는 소리와 은은한 향기가 마음의 안정을 줍니다.",
      price: "18,500원",
      imageUrl: "https://images.unsplash.com/photo-1602825213586-8c232950de02?auto=format&fit=crop&w=400&q=80"
    },
    {
      name: "무소음 탁상용 가습기",
      category: "리빙",
      description: "건조한 공기를 촉촉하게, 조용한 구동으로 집중력을 높여줍니다.",
      price: "32,000원",
      imageUrl: "https://images.unsplash.com/photo-1585759626612-14c85a808449?auto=format&fit=crop&w=400&q=80"
    },
    {
      name: "스트레스 볼 & 핸드 그립",
      category: "피젯 토이",
      description: "손으로 쥐었다 폈다 하며 긴장을 풀고 스트레스를 해소하세요.",
      price: "8,900원",
      imageUrl: "https://images.unsplash.com/photo-1622646872140-1ae39b263959?auto=format&fit=crop&w=400&q=80"
    },
    {
        name: "따뜻한 허브티 세트",
        category: "티/음료",
        description: "캐모마일, 페퍼민트 등 5가지 종류의 티로 마음을 녹여보세요.",
        price: "15,000원",
        imageUrl: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=400&q=80"
    },
    {
        name: "요가 매트 & 폼롤러",
        category: "운동/건강",
        description: "굳은 몸을 이완시키고 가벼운 스트레칭을 시작해보세요.",
        price: "29,900원",
        imageUrl: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?auto=format&fit=crop&w=400&q=80"
    }
  ],
  contents: [
    {
      title: "불안한 마음을 잠재우는 5분 호흡법",
      summary: "갑자기 가슴이 답답할 때, 4-7-8 호흡법으로 즉시 안정을 찾아보세요."
    },
    {
      title: "나를 돌보는 저녁 루틴 만들기",
      summary: "하루를 기분 좋게 마무리하는 3가지 작은 습관을 소개합니다."
    }
  ]
};

function getMockShoppingData() {
    const result = JSON.parse(JSON.stringify(MOCK_SHOPPING_DATA));
    result.products = result.products.map((p: any, i: number) => ({ ...p, id: `mock-prod-${i}` }));
    result.contents = result.contents.map((c: any, i: number) => ({ ...c, id: `mock-cont-${i}` }));
    return result;
}

export async function analyzeEmotionAndCreateQuest(
  diaryData: {
    text: string;
    mood: number;
    detailedEmotions: string[];
    keywords: string[];
    memo: string;
  },
  conversationStyle: UserProfile['conversationStyle']
): Promise<{ emotion: string; quests: RecommendedQuest[]; aiResponse: string; } | null> {
  if (!API_KEY) {
    throw new Error("API_KEY is not set. Please set the API_KEY environment variable.");
  }
  const openai = new OpenAI({ apiKey: API_KEY, dangerouslyAllowBrowser: true });

  const lengthInstruction = '세네 문장의 보통 길이로.';

  const empathyText = conversationStyle.empathySolution < 0.33 ? '매우 해결 중심적이고' : conversationStyle.empathySolution < 0.66 ? '공감과 해결의 균형을 맞추고' : '매우 공감 중심적이고';
  const friendlyText = conversationStyle.friendlyFormal < 0.33 ? '매우 친근한' : conversationStyle.friendlyFormal < 0.66 ? '적당히 친근한' : '정중한';
  const styleInstruction = `${empathyText} ${friendlyText} 어조로`;

  const moodDescriptions = ['매우 나쁨', '나쁨', '보통', '좋음', '매우 좋음'];

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "당신은 사용자의 감정 일기를 분석하고 도움이 되는 퀘스트를 제안하는 AI 친구입니다. 항상 JSON 형식으로 응답해야 합니다."
        },
        {
          role: "user",
          content: `사용자가 감정 일기를 작성하고 추가 정보를 제공했다. 이 정보를 바탕으로 다음 세 가지를 JSON 객체로 반환해줘:
1. emotion: 사용자가 선택한 감정들(${diaryData.detailedEmotions.join(', ')})과 일기 내용(${diaryData.text})을 종합적으로 고려하여 가장 두드러지는 핵심 감정 한 가지.
2. quests: 그 감정을 완화할 수 있는 매우 간단하고 실현 가능한 미니 퀘스트 3가지를 객체 배열로 생성. 각 퀘스트는 title(퀘스트 내용), duration(예상 소요 시간, 예: '15분', '1시간'), type(퀘스트 종류, 예: '쓰기', '행동하기', '생각하기'), icon(퀘스트를 나타내는 이모지 1개)을 포함해야 해.
3. aiResponse: 사용자의 일기와 감정에 공감하거나, 위로하거나, 간단한 질문을 하는 AI 친구의 답변 메시지. 이 메시지는 ${lengthInstruction} 스타일과 ${styleInstruction}으로 작성해줘.

일기 내용: "${diaryData.text}"
메모: "${diaryData.memo || '없음'}"
전반적인 기분 점수(0-4): ${diaryData.mood} (${moodDescriptions[diaryData.mood]})
선택한 감정: ${diaryData.detailedEmotions.join(', ')}
관련 키워드: ${diaryData.keywords.join(', ')}

응답 형식:
{
  "emotion": "핵심 감정",
  "quests": [
    {
      "title": "퀘스트 제목",
      "duration": "예상 시간",
      "type": "퀘스트 종류",
      "icon": "이모지"
    }
  ],
  "aiResponse": "공감 메시지"
}`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7
    });

    const jsonText = response.choices[0].message.content?.trim() || "{}";
    return JSON.parse(jsonText);

  } catch (error) {
    console.error("Error analyzing emotion and creating quest:", error);
    return null;
  }
}

const ALL_EMOTIONS = [
  ...EMOTIONS.neutral.items,
  ...EMOTIONS.positive.items,
  ...EMOTIONS.negative.items,
];

export async function analyzeTextForEmotionsAndKeywords(text: string): Promise<{ emotions: string[], keywords: string[] } | null> {
    if (!API_KEY) {
      console.error("API_KEY is not set.");
      return null;
    }
    if (!text.trim()) {
        return { emotions: [], keywords: [] };
    }
    const openai = new OpenAI({ apiKey: API_KEY, dangerouslyAllowBrowser: true });

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4-turbo-preview",
            messages: [
                {
                    role: "system",
                    content: "당신은 사용자의 일기 내용에서 감정과 키워드를 추출하는 AI입니다. 항상 JSON 형식으로 응답해야 합니다."
                },
                {
                    role: "user",
                    content: `사용자의 일기 내용에 담긴 감정을 분석하고 다음 두 가지를 JSON 객체로 반환해줘:
1. emotions: 다음 감정 목록에서 가장 관련성 높은 감정을 최대 3개까지 선택.
2. keywords: 다음 키워드 목록에서 가장 관련성 높은 키워드를 최대 3개까지 선택. 만약 관련성 높은 키워드가 없다면 빈 배열을 반환해줘.

선택된 항목들만 JSON 객체로 반환하고 다른 설명은 필요없어.

감정 목록: [${ALL_EMOTIONS.join(', ')}]
키워드 목록: [${KEYWORDS.join(', ')}]

일기 내용: "${text}"

응답 형식:
{
  "emotions": ["감정1", "감정2"],
  "keywords": ["키워드1", "키워드2"]
}`
                }
            ],
            response_format: { type: "json_object" },
            temperature: 0.5
        });

        const jsonText = response.choices[0].message.content?.trim() || "{}";
        const result = JSON.parse(jsonText);
        return {
            emotions: result.emotions || [],
            keywords: result.keywords || []
        };
    } catch (error) {
        console.error("Error analyzing text for emotions and keywords:", error);
        return null;
    }
}

export async function getChatResponse(
  message: string,
  conversationStyle: UserProfile['conversationStyle']
): Promise<string | null> {
  if (!API_KEY) {
    console.error("API_KEY is not set.");
    return "API 키가 설정되지 않았어요.";
  }
  const openai = new OpenAI({ apiKey: API_KEY, dangerouslyAllowBrowser: true });

  const empathyText = conversationStyle.empathySolution > 0.66 ? '매우 공감 중심적이고' : conversationStyle.empathySolution > 0.33 ? '공감과 해결의 균형을 맞추고' : '매우 해결 중심적이고';
  const friendlyText = conversationStyle.friendlyFormal < 0.33 ? '매우 친근한' : conversationStyle.friendlyFormal < 0.66 ? '적당히 친근한' : '정중한';
  const styleInstruction = `${empathyText} ${friendlyText} 어조로`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `당신은 사용자의 AI 친구 'RemindMe'입니다. 사용자의 메시지에 대해 ${styleInstruction}으로, 그리고 세네 문장 길이의 짧은 메시지로 답해주세요. 대화는 저장되지 않으니, 이전 대화를 기억할 필요는 없습니다.`
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.8,
      max_tokens: 200
    });
    return response.choices[0].message.content?.trim() || "죄송해요, 답변을 생성하는 데 실패했어요.";
  } catch (error) {
    console.error("Error getting chat response:", error);
    return "죄송해요, 지금은 답변을 드릴 수 없어요. 잠시 후 다시 시도해주세요.";
  }
}

export async function generateShoppingSuggestions(
  negativeKeywords: string[],
  userName: string
): Promise<{ bannerMessage: string, products: Product[], contents: Content[] } | null> {
  if (!API_KEY) {
    console.warn("API_KEY is not set. Returning mock data.");
    return Promise.resolve(getMockShoppingData());
  }
  const openai = new OpenAI({ apiKey: API_KEY, dangerouslyAllowBrowser: true });

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "당신은 사용자의 정신 건강을 돕는 AI 친구 'RemindMe'입니다. 힐링 아이템과 콘텐츠를 추천합니다. 항상 JSON 형식으로 응답해야 합니다."
        },
        {
          role: "user",
          content: `사용자 '${userName}'님은 최근 '${negativeKeywords.join(', ')}'과 같은 감정을 느끼고 있습니다. 이 감정들을 완화하는 데 도움이 될 만한 힐링 아이템과 콘텐츠를 추천해주세요. 응답은 반드시 한국어로, 아래의 스키마에 맞는 JSON 형식으로만 반환해주세요. 다른 설명은 추가하지 마세요.

- 'bannerMessage': 사용자에게 보내는 짧고 따뜻한 격려 메시지. (예: "OO님, 불안한 마음을 낮춰줄 오늘의 힐링 아이템을 준비했어요.")
- 'products': 6개의 상품 추천 객체 배열. 각 객체는 'name', 'category'(예: '아로마', '수면보조'), 'description', 'price'(예: "25,000원"), 'imageUrl'(https://picsum.photos/400/400?random=N 형식의 플레이스홀더 이미지 URL)을 포함해야 합니다.
- 'contents': 2개의 콘텐츠 추천 객체 배열. 각 객체는 'title', 'summary'를 포함해야 합니다.

응답 형식:
{
  "bannerMessage": "격려 메시지",
  "products": [
    {
      "name": "상품명",
      "category": "카테고리",
      "description": "설명",
      "price": "가격",
      "imageUrl": "이미지URL"
    }
  ],
  "contents": [
    {
      "title": "콘텐츠 제목",
      "summary": "요약"
    }
  ]
}`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.8
    });

    const jsonText = response.choices[0].message.content?.trim() || "{}";
    const result = JSON.parse(jsonText);

    result.products = result.products.map((p: Omit<Product, 'id'>, i: number) => ({ ...p, id: `prod-${Date.now()}-${i}` }));
    result.contents = result.contents.map((c: Omit<Content, 'id'>, i: number) => ({ ...c, id: `cont-${Date.now()}-${i}` }));

    return result;

  } catch (error) {
    console.error("Error generating shopping suggestions:", error);
    console.warn("Returning mock data due to error.");
    return Promise.resolve(getMockShoppingData());
  }
}
