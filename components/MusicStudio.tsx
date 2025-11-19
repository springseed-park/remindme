
import React from 'react';

// 사용자가 직접 링크를 수정할 수 있도록 정적 데이터로 변환했습니다.
// images 폴더에 shop_1.jpg ~ shop_6.jpg 이미지를 넣어주세요.
const DEMO_PRODUCTS = [
  {
    id: 'demo-1',
    name: "깊은잠 릴렉싱 잠잘오는 숙면 아로마 꿀잠",
    category: "수면 케어",
    description: "잠들기 전 베개에 뿌리면 라벤더 향이 깊은 숙면을 도와줍니다.",
    price: "13,900원",
    imageUrl: "../images/shop_1.jpg", // 로컬 이미지 경로
    link: "https://www.coupang.com/vp/products/7977676617?itemId=22122879550&vendorItemId=89532957072&sourceType=srp_top_banner_ads" // 여기에 실제 구매 링크를 넣어주세요
  },
  {
    id: 'demo-2',
    name: "알리사 프리미엄 무선 가습기",
    category: "리빙",
    description: "가숲기, 1분이면 완성되는 마치 숲 속 같이 청량한 촉촉함",
    price: "24,120원",
    imageUrl: "../images/shop_2.jpg",
    link: "https://www.coupang.com/vp/products/8371426122?itemId=24191037916&vendorItemId=93060581945&q=%EC%95%8C%EB%A6%AC%EC%82%AC+%ED%94%84%EB%A6%AC%EB%AF%B8%EC%97%84+%EB%AC%B4%EC%84%A0+%EA%B0%80%EC%8A%B5%EA%B8%B0&searchId=26bfa7b9676920&sourceType=search&itemsCount=36&searchRank=0&rank=0&traceId=mi5jq39v"
  },
  {
    id: 'demo-3',
    name: "캔들백화점 포레스트 아로마 캔들",
    category: "아로마",
    description: "발향력이 뛰어난 천연 소이캔들로 숲속의 상쾌한 향기를 느껴보세요.",
    price: "19,900원",
    imageUrl: "../images/shop_3.jpg",
    link: "https://www.coupang.com/vp/products/6975718416"
  },
  {
    id: 'demo-4',
    name: "루아르모 푸쉬팝 팝잇",
    category: "피젯 토이",
    description: "톡톡 누르면서 긴장을 풀고 스트레스를 해소하세요.",
    price: "3,510원",
    imageUrl: "../images/shop_4.jpg",
    link: "https://www.coupang.com/vp/products/8485770348?itemId=8911967595&vendorItemId=76198587018&q=%EC%8A%A4%ED%8A%B8%EB%A0%88%EC%8A%A4+%ED%95%B4%EC%86%8C%EC%9A%A9%ED%92%88&searchId=2307bcb696557&sourceType=search&itemsCount=36&searchRank=2&rank=2&traceId=mi5gq33u"
  },
  {
    id: 'demo-5',
    name: "아리프 EVA 소프트 폼롤러",
    category: "운동/건강",
    description: "굳은 몸을 이완시키고 가벼운 스트레칭을 시작해보세요.",
    price: "24,900원",
    imageUrl: "../images/shop_5.jpg",
    link: "https://www.coupang.com/vp/products/8717815555?itemId=25321180945&vendorItemId=77663345904&pickType=COU_PICK&sourceType=srp_product_ads&clickEventId=8ac1f240-c505-11f0-9f72-56c2ed1e61da&korePlacement=15&koreSubPlacement=1&clickEventId=8ac1f240-c505-11f0-9f72-56c2ed1e61da&korePlacement=15&koreSubPlacement=1&traceId=mi5jinlt"
  },
  {
    id: 'demo-6',
    name: "아름드레 유기농 삼각티백 허브차 선물세트",
    category: "티/음료",
    description: "향기로운 따뜻한 티로 마음의 여유를 찾아보세요.",
    price: "9,800원",
    imageUrl: "../images/shop_6.jpg",
    link: "https://www.coupang.com/vp/products/8244145577?itemId=219243633&vendorItemId=3021336277&pickType=COU_PICK&q=%ED%97%88%EB%B8%8C%ED%8B%B0+%EC%84%B8%ED%8A%B8&searchId=aac951a568093&sourceType=search&itemsCount=36&searchRank=1&rank=1&traceId=mi5jm3y0"
  }
];

// 블로그/콘텐츠 샘플 데이터입니다. 
// 여기에 직접 내용을 수정하시면 반영됩니다.
const DEMO_CONTENTS = [
    {
        id: 'content-1',
        title: "마음 치유에 도움 되는 창의적 감정 표현법",
        summary: "감정을 억누르지 않고 다양한 방식으로 밖으로 드러내는 일이 마음 건강에 큰 도움이 됩니다",
        imageUrl: "../images/content_1.png",
        link: "https://blog.naver.com/sxwhlaioq1/224059645245"
    },
    {
        id: 'content-2',
        title: "퇴근 후, 나를 돌보는 5가지 저녁 루틴", 
        summary: "하루 끝에 나를 위한 시간을 마련해보세요.",
        imageUrl: "../images/content_2.png",
        link: "https://content2421.tistory.com/15"
    },
    {
        id: 'content-3',
        title: "만성피로 원인 ‘자율신경실조증’ 무기력증 심해진 이유와 치료는? ",
        summary: "단순한 피로로 여겨지던 증상이 장기간 이어지고, 이유 없이 무기력한 상태가 반복된다면 단순한 체력 저하로만 치부할 수는 없다.",
        imageUrl: "../images/content_3.png",
        link: "https://www.jemin.com/news/articleView.html?idxno=820423"
    }
];

// 제품 타입 정의 (로컬)
interface DemoProduct {
    id: string;
    name: string;
    category: string;
    description: string;
    price: string;
    imageUrl: string;
    link: string;
}

// 콘텐츠 타입 정의
interface DemoContent {
    id: string;
    title: string;
    summary: string;
    imageUrl: string;
    link: string;
}

const ProductCard: React.FC<{ product: DemoProduct }> = ({ product }) => (
    <a 
        href={product.link} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block bg-gray-800 rounded-lg overflow-hidden shadow-lg animate-fade-in-up hover:ring-2 hover:ring-indigo-500 transition-all duration-200"
    >
        <div className="relative h-40 bg-gray-700 overflow-hidden">
             <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                    e.currentTarget.style.display = 'none';
                }}
             />
        </div>
        <div className="p-4">
            <p className="text-xs text-indigo-400 font-semibold">{product.category}</p>
            <h3 className="font-bold text-white mt-1 truncate">{product.name}</h3>
            <p className="text-sm text-gray-400 mt-1 h-10 overflow-hidden line-clamp-2">{product.description}</p>
            <div className="mt-3">
                <div className="flex justify-between items-center">
                    <p className="text-lg font-bold text-white">{product.price}</p>
                    <span className="bg-indigo-500 text-white font-semibold px-4 py-1.5 rounded-md text-sm hover:bg-indigo-600 transition">
                        구매하기
                    </span>
                </div>

            </div>
        </div>
    </a>
);

const ContentCard: React.FC<{ content: DemoContent }> = ({ content }) => (
    <a 
        href={content.link}
        target="_blank" 
        rel="noopener noreferrer"
        className="flex gap-4 bg-gray-800 p-4 rounded-lg shadow-lg animate-fade-in-up hover:bg-gray-750 transition duration-200 cursor-pointer"
    >
        <div className="w-24 h-24 bg-gray-700 rounded-md flex-shrink-0 overflow-hidden">
             <img 
                src={content.imageUrl} 
                alt={content.title} 
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                onError={(e) => {
                    e.currentTarget.style.display = 'none';
                }}
             />
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-center">
            <h3 className="font-bold text-white text-lg truncate mb-1">{content.title}</h3>
            <p className="text-sm text-gray-400 line-clamp-2">{content.summary}</p>
            <p className="text-xs text-indigo-400 mt-2 font-medium">자세히 보기 &rarr;</p>
        </div>
    </a>
);

const Shopping: React.FC = () => {
    return (
        <div className="p-4 pb-8">
            <h1 className="text-xl font-bold text-center text-gray-300 py-2 mb-4">힐링 쇼핑 공간</h1>
            
            <div className="bg-indigo-900/50 border border-indigo-700 text-center p-4 rounded-lg mb-8 animate-fade-in">
                <p className="text-indigo-200 font-medium">
                    지친 당신의 마음에 쉼표를 선물하세요. <br/>
                    엄선된 힐링 아이템을 모았습니다.
                </p>
            </div>

            <div className="mb-10">
                <h2 className="text-lg font-bold text-white mb-4 px-1">추천 아이템</h2>
                <div className="grid grid-cols-2 gap-4">
                    {DEMO_PRODUCTS.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>

            <div>
                <h2 className="text-lg font-bold text-white mb-4 px-1">마음 챙김 아티클</h2>
                <div className="space-y-4">
                    {DEMO_CONTENTS.map((content) => (
                        <ContentCard key={content.id} content={content} />
                    ))}
                </div>
            </div>
            
            <div className="mt-12 text-center pb-8">
                <p className="text-gray-500 text-sm">
                    더 많은 상품과 콘텐츠가 준비중입니다.
                </p>
            </div>
        </div>
    );
};

export default Shopping;
