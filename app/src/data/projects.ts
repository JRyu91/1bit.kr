// Home·Portfolio 가 같이 쓰는 프로젝트 데이터.
export type Project = {
  id: string;
  category: 'personal' | 'team';
  name: string;
  label: string;
  pdf: string;
  size: string;
  image: string;
  alt: string;
  summary: string;
  role: string;
  duties: string[];
  techNote?: string;
  tech: string[];
  service?: {label: string; href: string};
};

export const projects: Project[] = [
  {
    id: 'personal',
    category: 'personal',
    name: '개인 프로젝트',
    label: '웹게임 운영 인프라 · 시간 낭비의 숲 · PDF 13쪽',
    pdf: '/projects/Personal%20Project_web-game.pdf',
    size: '3.6MB',
    image: '/projects/personal-architecture.webp',
    alt: 'GKE 홈 채널·확장 채널, Redis와 Cloud SQL 연결 아키텍처',
    summary:
      '웹게임의 접속 세션을 유지하며 채널 수를 조절하는 운영 인프라입니다. 홈 채널은 온디맨드, 확장 채널은 Spot 노드풀에 배치했습니다.',
    role: '개인 수행 · 인프라 설계·구축·운영',
    duties: ['Terraform으로 GCP 인프라 구성', 'KEDA 기반 채널 확장·축소와 Redis 이관 구성', 'GitHub Actions·WIF로 빌드·배포 자동화'],
    tech: ['GCP', 'GKE', 'Terraform', 'Redis', 'Cloud SQL', 'GitHub Actions'],
    service: {label: '시간 낭비의 숲 플레이하기', href: '/game/'},
  },
  {
    id: 'hackathon',
    category: 'team',
    name: '해커톤',
    label: 'Partnerhub Cloud · Team Eclipse · PDF 13쪽',
    pdf: '/projects/Hackathon_Team%20Eclipse.pdf',
    size: '1.9MB',
    image: '/projects/hackathon-architecture.webp',
    alt: 'Partnerhub Cloud의 GKE 애플리케이션·PostgreSQL·GCS 및 배포·관리 접근 아키텍처',
    summary:
      '제조 협력사의 품질 데이터를 관리하고 AI 이상 탐지를 연계하는 플랫폼 제안·데모입니다. 팀은 GKE 배포와 Key-less CI/CD를 구성했습니다.',
    role: '담당 · 기획·발표·QA',
    duties: ['사업 시나리오 구상', '데모 7단계 E2E 검증', '트러블슈팅 기록 및 최종 발표'],
    techNote: '팀 기술',
    tech: ['GCP', 'GKE', 'Terraform', 'WIF'],
  },
  {
    id: 'endive',
    category: 'team',
    name: '2차 프로젝트',
    label: 'ENDIVE-CLOUD · PDF 27쪽',
    pdf: '/projects/2st%20Project_Team%20Endive.pdf',
    size: '11.3MB',
    image: '/projects/endive-architecture.webp',
    alt: 'AWS 서울 Active·도쿄 DR, OpenStack 모니터링 연결 아키텍처',
    summary:
      '서울 운영·도쿄 재해복구 환경을 구성한 야외행사 안내 플랫폼입니다. 팀은 리전 간 백업·이미지 복제와 OpenStack 중앙 관제를 연계했습니다.',
    role: '담당 · Kubernetes 구축·Ansible 자동화',
    duties: ['프로비저닝된 인프라에 Kubernetes 클러스터 구축', 'Ansible로 클러스터 설치·설정 자동화'],
    techNote: '팀 기술',
    tech: ['AWS', 'OpenStack', 'Kubernetes', 'Terraform', 'Ansible'],
  },
  {
    id: 'bluebell',
    category: 'team',
    name: '1차 프로젝트',
    label: 'Bluebell · PDF 22쪽',
    pdf: '/projects/1st%20Project_Team%20Bluebell.pdf',
    size: '5.6MB',
    image: '/projects/bluebell-architecture.webp',
    alt: 'AWS Web·WAS·DB 3-Tier와 Prometheus·Grafana 모니터링 아키텍처',
    summary:
      'AWS·온프레미스 3-Tier 환경의 구축·배포·장애복구 자동화 프로젝트입니다. 팀의 서비스 흐름에 모니터링과 알림 구성을 연결했습니다.',
    role: '담당 · Monitoring·Alerting 자동화',
    duties: ['Prometheus·Grafana 모니터링 스택 배포 자동화', '노드 Exporter 및 Alerting 프로비저닝 자동화'],
    techNote: '팀 기술',
    tech: ['AWS', 'Ansible', 'Docker Swarm', 'Prometheus', 'Grafana'],
  },
];
