'use client'

import {useEffect, useState} from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'

const analysisData: Record<
  string,
  {country: string; type: string; penalty: string; criminal: string; law: string}
> = {
  'q7-0': {
    country: '네덜란드',
    type: '문서 미비',
    penalty: '최대 손해률 5% + 명단 공개',
    criminal: '없음',
    law: 'WiVO Article.4'
  },
  'q7-1': {
    country: '프랑스',
    type: '보고 미제출',
    penalty: '3% 벌금',
    criminal: '있음',
    law: 'FR Article.3'
  },
  'q7-2': {
    country: '독일',
    type: '과학기반 목표 미수립',
    penalty: '2% 벌금',
    criminal: '있음',
    law: 'DEU Code 12.1'
  },
  'q7-3': {
    country: '스페인',
    type: '이행 계획 없음',
    penalty: '명단 공개',
    criminal: '없음',
    law: 'SP Regulation 9'
  },
  'q7-4': {
    country: '이탈리아',
    type: '관리체계 미비',
    penalty: '최대 손해률 3%',
    criminal: '있음',
    law: 'IT Law Art.8'
  },
  'q7-5': {
    country: '벨기에',
    type: '성과 모니터링 미흡',
    penalty: '최대 손해률 4%',
    criminal: '없음',
    law: 'BE Guide B-22'
  },
  'q1-14': {
    country: '폴란드',
    type: '제보자 보호 조치 미비',
    penalty: '손해배상 + 벌금 2%',
    criminal: '있음',
    law: 'PL Article.10'
  },
  'q1-15': {
    country: '체코',
    type: '피해 구제 조치 미비',
    penalty: '명단 공개',
    criminal: '없음',
    law: 'CZ Law 5.7'
  },
  // q1 추가 항목들
  'q1-0': {
    country: '핀란드',
    type: '리스크 분석 미비',
    penalty: '1% 벌금',
    criminal: '없음',
    law: 'FI Code A1'
  },
  'q1-1': {
    country: '스웨덴',
    type: '리스크 식별 부족',
    penalty: '명단 공개',
    criminal: '없음',
    law: 'SE Statute 2'
  },
  'q1-2': {
    country: '노르웨이',
    type: '실사 정책 없음',
    penalty: '최대 손해률 2%',
    criminal: '있음',
    law: 'NO Act 15'
  },
  'q1-3': {
    country: '덴마크',
    type: '구제 절차 미흡',
    penalty: '1.5% 벌금',
    criminal: '있음',
    law: 'DK Law D2'
  },
  'q1-4': {
    country: '포르투갈',
    type: '이해관계자 미포함',
    penalty: '벌금 2%',
    criminal: '없음',
    law: 'PT Rule 8'
  },
  'q1-5': {
    country: '헝가리',
    type: '정보 공개 부족',
    penalty: '공표',
    criminal: '없음',
    law: 'HU Article 7'
  },
  'q1-6': {
    country: '아일랜드',
    type: '교육 미실시',
    penalty: '교육 명령',
    criminal: '있음',
    law: 'IE Statute 6'
  },
  'q1-7': {
    country: '오스트리아',
    type: '사후 점검 미흡',
    penalty: '2% 벌금',
    criminal: '있음',
    law: 'AT Compliance 3'
  },
  'q1-8': {
    country: '슬로베니아',
    type: '공급망 모니터링 부족',
    penalty: '1% 벌금',
    criminal: '없음',
    law: 'SI Law 10'
  },
  'q1-9': {
    country: '루마니아',
    type: '리스크 평가 누락',
    penalty: '3% 벌금',
    criminal: '있음',
    law: 'RO Code X'
  },
  'q1-10': {
    country: '크로아티아',
    type: '이행 계획 누락',
    penalty: '명단 공개',
    criminal: '없음',
    law: 'HR Article 22'
  },
  'q1-11': {
    country: '리투아니아',
    type: '주기적 평가 없음',
    penalty: '2.5% 벌금',
    criminal: '있음',
    law: 'LT Statute Y'
  },
  'q1-12': {
    country: '에스토니아',
    type: '리스크 조치 부재',
    penalty: '공표',
    criminal: '없음',
    law: 'EE Law 99'
  },
  'q1-13': {
    country: '헝가리',
    type: '피해자 보상 절차 미흡',
    penalty: '벌금 1.5%',
    criminal: '있음',
    law: 'HU Article.22'
  },
  // q2
  'q2-0': {
    country: '영국',
    type: '리스크 평가 미흡',
    penalty: '1% 벌금',
    criminal: '없음',
    law: 'UK Law A1'
  },
  'q2-1': {
    country: '프랑스',
    type: '지속 가능성 정보 부족',
    penalty: '명단 공개',
    criminal: '있음',
    law: 'FR Act B2'
  },
  'q2-2': {
    country: '독일',
    type: '데이터 미공개',
    penalty: '2% 벌금',
    criminal: '있음',
    law: 'DE Statute 3'
  },
  'q2-3': {
    country: '네덜란드',
    type: '연차 보고서 누락',
    penalty: '공표',
    criminal: '없음',
    law: 'NL Guide 4'
  },
  'q2-4': {
    country: '스페인',
    type: '법적 근거 미표시',
    penalty: '벌금 1.5%',
    criminal: '없음',
    law: 'ES Code 5'
  },
  'q2-5': {
    country: '이탈리아',
    type: '평가 체계 미비',
    penalty: '2.5% 벌금',
    criminal: '있음',
    law: 'IT Rule 6'
  },
  'q2-6': {
    country: '포르투갈',
    type: '공시 지연',
    penalty: '명단 공개',
    criminal: '없음',
    law: 'PT Law 7'
  },
  'q2-7': {
    country: '그리스',
    type: '지표 누락',
    penalty: '최대 손해률 2%',
    criminal: '있음',
    law: 'GR Statute 8'
  },
  'q2-8': {
    country: '루마니아',
    type: '자료 오류',
    penalty: '1% 벌금',
    criminal: '없음',
    law: 'RO Article 9'
  },
  'q2-9': {
    country: '불가리아',
    type: '공개 범위 부족',
    penalty: '공표',
    criminal: '없음',
    law: 'BG Law 10'
  },
  'q2-10': {
    country: '체코',
    type: '리스크 항목 누락',
    penalty: '3% 벌금',
    criminal: '있음',
    law: 'CZ Code 11'
  },
  'q2-11': {
    country: '헝가리',
    type: '진위성 문제',
    penalty: '명단 공개',
    criminal: '없음',
    law: 'HU Rule 12'
  },
  'q2-12': {
    country: '슬로바키아',
    type: '정보 왜곡',
    penalty: '2% 벌금',
    criminal: '있음',
    law: 'SK Act 13'
  },
  'q2-13': {
    country: '슬로베니아',
    type: '이행 내용 누락',
    penalty: '공표',
    criminal: '없음',
    law: 'SI Guide 14'
  },
  'q2-14': {
    country: '크로아티아',
    type: '정량 데이터 미비',
    penalty: '1% 벌금',
    criminal: '있음',
    law: 'HR Statute 15'
  },
  'q2-15': {
    country: '리투아니아',
    type: '지표 근거 누락',
    penalty: '2.5% 벌금',
    criminal: '없음',
    law: 'LT Code 16'
  },
  // q3
  'q3-0': {
    country: '벨기에',
    type: '공시 기준 미준수',
    penalty: '2% 벌금',
    criminal: '없음',
    law: 'BE Law Q1'
  },
  'q3-1': {
    country: '스웨덴',
    type: '자료 누락',
    penalty: '명단 공개',
    criminal: '있음',
    law: 'SE Statute Q2'
  },
  'q3-2': {
    country: '노르웨이',
    type: '리스크 평가 미흡',
    penalty: '1.5% 벌금',
    criminal: '없음',
    law: 'NO Act Q3'
  },
  'q3-3': {
    country: '핀란드',
    type: '이행 보고서 누락',
    penalty: '공표',
    criminal: '있음',
    law: 'FI Code Q4'
  },
  'q3-4': {
    country: '덴마크',
    type: '평가 체계 부재',
    penalty: '3% 벌금',
    criminal: '없음',
    law: 'DK Guide Q5'
  },
  'q3-5': {
    country: '오스트리아',
    type: '법적 근거 미기재',
    penalty: '2.5% 벌금',
    criminal: '있음',
    law: 'AT Rule Q6'
  },
  'q3-6': {
    country: '아일랜드',
    type: '지표 오류',
    penalty: '명단 공개',
    criminal: '없음',
    law: 'IE Law Q7'
  },
  'q3-7': {
    country: '에스토니아',
    type: '자료 미공개',
    penalty: '공표',
    criminal: '있음',
    law: 'EE Statute Q8'
  },
  'q3-8': {
    country: '라트비아',
    type: '지속 가능성 정보 누락',
    penalty: '1% 벌금',
    criminal: '없음',
    law: 'LV Article Q9'
  },
  'q3-9': {
    country: '폴란드',
    type: '공개 범위 부족',
    penalty: '2% 벌금',
    criminal: '있음',
    law: 'PL Law Q10'
  },
  'q3-10': {
    country: '불가리아',
    type: '리스크 식별 미흡',
    penalty: '명단 공개',
    criminal: '없음',
    law: 'BG Code Q11'
  },
  'q3-11': {
    country: '슬로베니아',
    type: '정보 오류',
    penalty: '공표',
    criminal: '있음',
    law: 'SI Rule Q12'
  },
  'q3-12': {
    country: '헝가리',
    type: '이행 내용 미흡',
    penalty: '1% 벌금',
    criminal: '없음',
    law: 'HU Act Q13'
  },
  'q3-13': {
    country: '슬로바키아',
    type: '정량 데이터 부족',
    penalty: '2.5% 벌금',
    criminal: '있음',
    law: 'SK Guide Q14'
  },
  'q3-14': {
    country: '크로아티아',
    type: '지표 근거 미기재',
    penalty: '3% 벌금',
    criminal: '없음',
    law: 'HR Statute Q15'
  },
  'q3-15': {
    country: '리투아니아',
    type: '자료 미비',
    penalty: '명단 공개',
    criminal: '있음',
    law: 'LT Code Q16'
  },
  // q4
  'q4-0': {
    country: '체코',
    type: '리스크 평가 미흡',
    penalty: '2% 벌금',
    criminal: '없음',
    law: 'CZ Law R1'
  },
  'q4-1': {
    country: '에스토니아',
    type: '지속 가능성 정보 부족',
    penalty: '명단 공개',
    criminal: '있음',
    law: 'EE Statute R2'
  },
  'q4-2': {
    country: '라트비아',
    type: '데이터 미공개',
    penalty: '1.5% 벌금',
    criminal: '있음',
    law: 'LV Act R3'
  },
  'q4-3': {
    country: '폴란드',
    type: '연차 보고서 누락',
    penalty: '공표',
    criminal: '없음',
    law: 'PL Code R4'
  },
  'q4-4': {
    country: '슬로베니아',
    type: '법적 근거 미표시',
    penalty: '3% 벌금',
    criminal: '없음',
    law: 'SI Guide R5'
  },
  'q4-5': {
    country: '헝가리',
    type: '평가 체계 미비',
    penalty: '2.5% 벌금',
    criminal: '있음',
    law: 'HU Rule R6'
  },
  'q4-6': {
    country: '슬로바키아',
    type: '공시 지연',
    penalty: '명단 공개',
    criminal: '없음',
    law: 'SK Law R7'
  },
  'q4-7': {
    country: '크로아티아',
    type: '지표 누락',
    penalty: '공표',
    criminal: '있음',
    law: 'HR Statute R8'
  },
  'q4-8': {
    country: '리투아니아',
    type: '자료 오류',
    penalty: '1% 벌금',
    criminal: '없음',
    law: 'LT Article R9'
  },
  'q4-9': {
    country: '불가리아',
    type: '공개 범위 부족',
    penalty: '2% 벌금',
    criminal: '있음',
    law: 'BG Law R10'
  },
  'q4-10': {
    country: '체코',
    type: '리스크 항목 누락',
    penalty: '명단 공개',
    criminal: '없음',
    law: 'CZ Code R11'
  },
  'q4-11': {
    country: '에스토니아',
    type: '진위성 문제',
    penalty: '공표',
    criminal: '있음',
    law: 'EE Rule R12'
  },
  'q4-12': {
    country: '라트비아',
    type: '정보 왜곡',
    penalty: '1.5% 벌금',
    criminal: '없음',
    law: 'LV Act R13'
  },
  'q4-13': {
    country: '폴란드',
    type: '이행 내용 누락',
    penalty: '2.5% 벌금',
    criminal: '있음',
    law: 'PL Guide R14'
  },
  'q4-14': {
    country: '슬로베니아',
    type: '정량 데이터 미비',
    penalty: '3% 벌금',
    criminal: '없음',
    law: 'SI Statute R15'
  },
  'q4-15': {
    country: '헝가리',
    type: '지표 근거 누락',
    penalty: '명단 공개',
    criminal: '있음',
    law: 'HU Code R16'
  },
  // q5
  'q5-0': {
    country: '오스트리아',
    type: '공시 기준 미준수',
    penalty: '1% 벌금',
    criminal: '없음',
    law: 'AT Law S1'
  },
  'q5-1': {
    country: '아일랜드',
    type: '자료 누락',
    penalty: '명단 공개',
    criminal: '있음',
    law: 'IE Statute S2'
  },
  'q5-2': {
    country: '에스토니아',
    type: '리스크 평가 미흡',
    penalty: '2% 벌금',
    criminal: '없음',
    law: 'EE Act S3'
  },
  'q5-3': {
    country: '라트비아',
    type: '이행 보고서 누락',
    penalty: '공표',
    criminal: '있음',
    law: 'LV Code S4'
  },
  'q5-4': {
    country: '폴란드',
    type: '평가 체계 부재',
    penalty: '2.5% 벌금',
    criminal: '없음',
    law: 'PL Guide S5'
  },
  'q5-5': {
    country: '슬로베니아',
    type: '법적 근거 미기재',
    penalty: '3% 벌금',
    criminal: '있음',
    law: 'SI Rule S6'
  },
  'q5-6': {
    country: '헝가리',
    type: '지표 오류',
    penalty: '명단 공개',
    criminal: '없음',
    law: 'HU Law S7'
  },
  'q5-7': {
    country: '슬로바키아',
    type: '자료 미공개',
    penalty: '공표',
    criminal: '있음',
    law: 'SK Statute S8'
  },
  'q5-8': {
    country: '크로아티아',
    type: '지속 가능성 정보 누락',
    penalty: '1.5% 벌금',
    criminal: '없음',
    law: 'HR Article S9'
  },
  'q5-9': {
    country: '리투아니아',
    type: '공개 범위 부족',
    penalty: '2% 벌금',
    criminal: '있음',
    law: 'LT Law S10'
  },
  'q5-10': {
    country: '체코',
    type: '리스크 식별 미흡',
    penalty: '명단 공개',
    criminal: '없음',
    law: 'CZ Code S11'
  },
  'q5-11': {
    country: '에스토니아',
    type: '정보 오류',
    penalty: '공표',
    criminal: '있음',
    law: 'EE Rule S12'
  },
  'q5-12': {
    country: '라트비아',
    type: '이행 내용 미흡',
    penalty: '1% 벌금',
    criminal: '없음',
    law: 'LV Act S13'
  },
  'q5-13': {
    country: '폴란드',
    type: '정량 데이터 부족',
    penalty: '2.5% 벌금',
    criminal: '있음',
    law: 'PL Guide S14'
  },
  'q5-14': {
    country: '슬로베니아',
    type: '지표 근거 미기재',
    penalty: '3% 벌금',
    criminal: '없음',
    law: 'SI Statute S15'
  },
  'q5-15': {
    country: '헝가리',
    type: '자료 미비',
    penalty: '명단 공개',
    criminal: '있음',
    law: 'HU Code S16'
  },
  // q6
  'q6-0': {
    country: '노르웨이',
    type: '리스크 평가 미흡',
    penalty: '1% 벌금',
    criminal: '없음',
    law: 'NO Law T1'
  },
  'q6-1': {
    country: '덴마크',
    type: '지속 가능성 정보 부족',
    penalty: '명단 공개',
    criminal: '있음',
    law: 'DK Statute T2'
  },
  'q6-2': {
    country: '핀란드',
    type: '데이터 미공개',
    penalty: '2% 벌금',
    criminal: '있음',
    law: 'FI Act T3'
  },
  'q6-3': {
    country: '스웨덴',
    type: '연차 보고서 누락',
    penalty: '공표',
    criminal: '없음',
    law: 'SE Code T4'
  },
  'q6-4': {
    country: '벨기에',
    type: '법적 근거 미표시',
    penalty: '벌금 1.5%',
    criminal: '없음',
    law: 'BE Guide T5'
  },
  'q6-5': {
    country: '프랑스',
    type: '평가 체계 미비',
    penalty: '2.5% 벌금',
    criminal: '있음',
    law: 'FR Rule T6'
  },
  'q6-6': {
    country: '독일',
    type: '공시 지연',
    penalty: '명단 공개',
    criminal: '없음',
    law: 'DE Law T7'
  },
  'q6-7': {
    country: '네덜란드',
    type: '지표 누락',
    penalty: '최대 손해률 2%',
    criminal: '있음',
    law: 'NL Statute T8'
  },
  'q6-8': {
    country: '스페인',
    type: '자료 오류',
    penalty: '1% 벌금',
    criminal: '없음',
    law: 'ES Article T9'
  },
  'q6-9': {
    country: '이탈리아',
    type: '공개 범위 부족',
    penalty: '공표',
    criminal: '없음',
    law: 'IT Law T10'
  },
  'q6-10': {
    country: '포르투갈',
    type: '리스크 항목 누락',
    penalty: '3% 벌금',
    criminal: '있음',
    law: 'PT Code T11'
  },
  'q6-11': {
    country: '그리스',
    type: '진위성 문제',
    penalty: '명단 공개',
    criminal: '없음',
    law: 'GR Rule T12'
  },
  'q6-12': {
    country: '루마니아',
    type: '정보 왜곡',
    penalty: '2% 벌금',
    criminal: '있음',
    law: 'RO Act T13'
  },
  'q6-13': {
    country: '불가리아',
    type: '이행 내용 누락',
    penalty: '공표',
    criminal: '없음',
    law: 'BG Guide T14'
  },
  'q6-14': {
    country: '체코',
    type: '정량 데이터 미비',
    penalty: '1% 벌금',
    criminal: '있음',
    law: 'CZ Statute T15'
  },
  'q6-15': {
    country: '헝가리',
    type: '지표 근거 누락',
    penalty: '2.5% 벌금',
    criminal: '없음',
    law: 'HU Code T16'
  },
  'q7-6': {
    country: '그리스',
    type: '정책 검토 미흡',
    penalty: '1% 벌금',
    criminal: '없음',
    law: 'GR Reg 3.1'
  },
  'q7-7': {
    country: '불가리아',
    type: '투자 계획 미비',
    penalty: '손해배상 청구',
    criminal: '있음',
    law: 'BG Compliance 7'
  },
  'q7-8': {
    country: '라트비아',
    type: '모니터링 시스템 없음',
    penalty: '최대 손해률 2%',
    criminal: '없음',
    law: 'LV Code 11'
  },
  'q7-9': {
    country: '룩셈부르크',
    type: '리더십 부재',
    penalty: '명단 공개',
    criminal: '있음',
    law: 'LU Act 5.5'
  },
  'q7-10': {
    country: '슬로바키아',
    type: '문서화 실패',
    penalty: '3% 벌금',
    criminal: '없음',
    law: 'SK Statute 4'
  },
  // q7 보충
  'q7-11': {
    country: '몰타',
    type: '이행 검토 없음',
    penalty: '1% 벌금',
    criminal: '없음',
    law: 'MT Code A'
  },
  'q7-12': {
    country: '사이프러스',
    type: '공개 지연',
    penalty: '명단 공개',
    criminal: '있음',
    law: 'CY Act B'
  },
  'q7-13': {
    country: '아이슬란드',
    type: '목표 설정 없음',
    penalty: '2.5% 벌금',
    criminal: '없음',
    law: 'IS Rule C'
  },
  'q7-14': {
    country: '리히텐슈타인',
    type: '실행 책임 불명확',
    penalty: '최대 손해률 2%',
    criminal: '있음',
    law: 'LI Code D'
  },
  'q7-15': {
    country: '모나코',
    type: '관리 주체 없음',
    penalty: '공표',
    criminal: '없음',
    law: 'MC Law E'
  }
}

export default function EUDDResultPage() {
  const [results, setResults] = useState<string[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('euddResults')
    if (saved) {
      setResults(JSON.parse(saved))
    }
  }, [])

  return (
    <div className="flex flex-col w-full h-full p-8">
      <div className="flex flex-row px-4 mb-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/csddd">공급망 실사</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>EU 공급망실사</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex flex-col w-full h-full px-4 pb-2 bg-white border rounded">
        <div className="flex items-center h-12">
          <h1 className="items-center text-xl font-bold text-gray-800">
            EU 공급망 실사 지침 요구사항 이행 자가진단 결과
          </h1>
        </div>
        <table className="w-full text-sm text-left border border-gray-200 rounded-lg">
          <thead className="font-semibold text-gray-700 bg-gray-50">
            <tr>
              <th className="px-6 py-4 border-b border-gray-200">국가</th>
              <th className="px-6 py-4 border-b border-gray-200">위반 유형</th>
              <th className="px-6 py-4 border-b border-gray-200">예상 벌금 비율</th>
              <th className="px-6 py-4 border-b border-gray-200">형사 책임</th>
              <th className="px-6 py-4 border-b border-gray-200">법적 근거</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {results
              .filter(id => analysisData[id])
              .map(id => (
                <tr key={id} className="transition-colors hover:bg-gray-100">
                  <td className="px-6 py-4 border-b border-gray-100">
                    {analysisData[id].country}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-100">
                    {analysisData[id].type}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-100">
                    {analysisData[id].penalty}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-100">
                    {analysisData[id].criminal}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-700 border-b border-gray-100">
                    {analysisData[id].law}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
