// Home·Profile·Portfolio 가 같이 쓰는 프로젝트 데이터. 배열 순서 = 화면 순서(진행 중 → 최근 → 1차).
export type Project = {
  id: string;
  category: 'personal' | 'team';
  tag: string;
  title: string;
  period: string;
  team: string;
  contribution: string;
  inProgress?: boolean;
  pdf?: string;
  size?: string;
  image: string;
  imageFull?: string;
  alt: string;
  summary: string;
  role: string;
  duties: string[];
  achievements?: string[];
  troubleshooting?: {title: string; text: string}[];
  why?: string;
  lessons?: string;
  compact?: boolean;
  techNote?: string;
  tech: string[];
  service?: {label: string; href: string};
};

export const projects: Project[] = [
  {
    id: 'final',
    category: 'team',
    tag: 'Final Project',
    title: '식품·제조업 SaaS를 위한 멀티클라우드 SI 인프라',
    period: '2026.09.07~',
    team: '6인',
    contribution: '35%',
    inProgress: true,
    image: '/projects/final-architecture.webp',
    imageFull: '/projects/final-architecture-full.webp',
    alt: 'AWS 도쿄 EKS 주 운영·서울 DR Standby, KT Cloud 데이터 계층을 IPsec으로 연결한 멀티클라우드 아키텍처',
    summary:
      '식품·제조업에 SaaS를 제공하는 멀티클라우드 인프라입니다. AWS 도쿄 EKS가 주 운영을 맡고, 서울은 Terraform으로 다시 세우는 DR Standby입니다. 데이터 계층은 KT Cloud에 두고 IPsec으로 연결합니다.',
    role: '팀장·PM · 아키텍처 설계·Terraform 프로비저닝',
    duties: [
      '프로젝트 일정 관리 및 팀원별 업무 조율',
      'AWS·KT Cloud 멀티클라우드 아키텍처 설계',
      'Terraform 기반 Working/Standby 인프라 프로비저닝 구현',
      '기술 이슈 검토 및 인프라 구성 방향 협의',
    ],
    techNote: '팀 기술',
    tech: ['AWS', 'EKS', 'KT Cloud', 'Terraform', 'Istio', 'Argo CD', 'Karpenter', 'Harbor', 'Prometheus', 'Grafana'],
  },
  {
    id: 'personal',
    category: 'personal',
    tag: 'Personal Project',
    title: '시간 낭비의 숲 · 웹게임 운영 인프라',
    period: '2026.08.24~09.06',
    team: '1인',
    contribution: '100%',
    pdf: '/projects/Personal%20Project_web-game.pdf',
    size: '3.6MB',
    image: '/projects/personal-architecture.webp',
    alt: 'GKE 홈 채널·확장 채널, Redis와 Cloud SQL 연결 아키텍처',
    summary:
      '웹게임의 접속 세션을 유지하며 채널 수를 조절하는 운영 인프라입니다. 홈 채널은 온디맨드, 확장 채널은 Spot 노드풀에 배치했습니다.',
    role: '개인 수행 · 인프라 설계·구축·운영',
    duties: [
      'Terraform으로 GCP 인프라 구성',
      'GKE On-Demand·Spot 노드풀 분리, KEDA 기반 채널 자동 확장',
      'GitHub Actions·WIF로 빌드·배포 자동화',
    ],
    achievements: ['교육과정 개인 프로젝트 우수 사례 선정·발표', '서비스 운영 중'],
    troubleshooting: [
      {
        title: 'Spot 노드 회수로 서비스 중단',
        text: '워커 노드를 모두 Spot VM으로 두었다가 노드 회수로 메인 채널이 두 차례 이상 중단됐습니다. 접속이 유지돼야 하는 메인 채널·Redis는 On-Demand 노드 최소 1대에 두고, 확장 채널만 Spot 노드풀로 분리했습니다.',
      },
      {
        title: 'WIF 리소스 삭제로 CI/CD 인증 실패',
        text: 'Terraform으로 인프라를 삭제하면서 WIF 리소스까지 지워졌고, 30일 소프트 삭제 상태라 같은 이름으로 재생성할 수 없었습니다. gcloud undelete로 Workload Identity Provider를 복구하고 terraform import로 상태 파일에 다시 편입했습니다.',
      },
    ],
    why: 'PC와 모바일에서 앱 설치 없이 접속하는 웹게임을 직접 만들고, 클라우드에서 운영까지 해 보려고 시작했습니다.',
    tech: ['GCP', 'GKE', 'Terraform', 'KEDA', 'Redis', 'Cloud SQL', 'GitHub Actions'],
    service: {label: '시간 낭비의 숲 플레이하기', href: '/game/'},
  },
  {
    id: 'hackathon',
    category: 'team',
    tag: 'Hackathon',
    title: 'Partnerhub Cloud · AI 제조 공정 품질관리 SaaS',
    period: '2026.08.19~08.21',
    team: '7인',
    contribution: '30%',
    pdf: '/projects/Hackathon_Team%20Eclipse.pdf',
    size: '1.9MB',
    image: '/projects/hackathon-architecture.webp',
    alt: 'Partnerhub Cloud의 GKE 애플리케이션·PostgreSQL·GCS 및 배포·관리 접근 아키텍처',
    summary:
      'PCB SMT 제조 협력사의 품질 데이터를 관리하고 AI 이상 탐지를 연계하는 플랫폼 제안·데모입니다. 팀은 GKE 배포와 Key-less CI/CD를 구성했습니다.',
    role: '팀장·PM · 기획·아키텍처 설계·QA·발표',
    duties: ['인프라 아키텍처 설계', '7단계 E2E 서비스 검증·QA', '7인 팀의 기술 이슈 조율', '최종 발표'],
    lessons:
      '이전 직장에서 본 제조 공정 경험으로 아이디어를 내 팀원들을 설득했습니다. 짧은 일정에서는 기능 하나보다 전체 서비스의 연계와 완성도를 먼저 챙겼고, 소통과 합리적인 의사결정이 결과로 이어졌습니다.',
    achievements: ['KT Cloud Infra 과정 해커톤 1위'],
    techNote: '팀 기술',
    tech: ['GCP', 'GKE', 'Terraform', 'WIF'],
  },
  {
    id: 'endive',
    category: 'team',
    tag: '2nd Project',
    title: 'ENDIVE-CLOUD · AWS 멀티리전 DR 인프라',
    period: '2026.07.15~08.18',
    team: '5인',
    contribution: '20%',
    pdf: '/projects/2st%20Project_Team%20Endive.pdf',
    size: '11.3MB',
    image: '/projects/endive-architecture.webp',
    alt: 'AWS 서울 Active·도쿄 DR, OpenStack 모니터링 연결 아키텍처',
    summary:
      '서울 운영·도쿄 재해복구 환경을 구성한 야외행사 안내 플랫폼입니다. 팀은 리전 간 백업·이미지 복제와 OpenStack 중앙 관제를 연계했습니다.',
    role: 'Kubernetes 구축·Ansible 자동화',
    duties: [
      'kubeadm Kubernetes 클러스터 구축, Ansible로 설치·설정 자동화',
      'AWS 태그 기반 Dynamic Inventory 적용',
      '장애 시 도쿄 DR 클러스터를 재구성하는 Ansible Playbook 구현',
      'Helm·Ingress·Argo CD 배포 구성',
    ],
    achievements: ['Ansible 기반 Kubernetes 구성 자동화·DR 복구 동작 검증'],
    why: 'Ansible 인벤토리를 동적으로 관리하려고 AWS 태그 기반 Dynamic Inventory를 적용했습니다.',
    lessons:
      '리소스 태깅이 왜 중요한지 알게 됐습니다. 인프라는 구축보다 장애가 났을 때 얼마나 빠르고 일관되게 복구하느냐가 중요하다는 점을 배웠습니다.',
    techNote: '팀 기술',
    tech: ['AWS', 'OpenStack', 'Kubernetes', 'Terraform', 'Ansible', 'Argo CD'],
  },
  {
    id: 'bluebell',
    category: 'team',
    tag: '1st Project',
    title: 'Bluebell · AWS·온프레미스 하이브리드 3-Tier 인프라',
    period: '2026.06.11~07.14',
    team: '5인',
    contribution: '20%',
    pdf: '/projects/1st%20Project_Team%20Bluebell.pdf',
    size: '5.6MB',
    image: '/projects/bluebell-architecture.webp',
    alt: 'AWS Web·WAS·DB 3-Tier와 Prometheus·Grafana 모니터링 아키텍처',
    summary: 'AWS·온프레미스 3-Tier 환경의 구축·배포·장애복구 자동화 프로젝트입니다. 팀의 서비스 흐름에 모니터링과 알림 구성을 연결했습니다.',
    role: 'Monitoring·Alerting 자동화',
    duties: [
      'Prometheus·Grafana로 서버·컨테이너·DB 메트릭 수집·대시보드 구성',
      'Ansible로 Exporter·Dashboard 배포 자동화(Monitoring VM 장애 대비)',
      'Grafana Alert Rule·Contact Point 구성',
    ],
    achievements: ['노드 장애 감지·이메일 알림 동작 검증'],
    compact: true,
    why: '비용 때문에 리소스를 자주 지우고 다시 만들어야 해서, 모니터링 환경 구축을 Ansible로 자동화했습니다.',
    lessons:
      '서비스가 동작하는 것만큼, 문제가 생겼을 때 원인을 빨리 찾을 수 있는 환경이 중요하다는 걸 배웠습니다. 매번 같은 환경만 만드는 자동화가 맞는지 고민하다가, 2차 프로젝트에서 동적 인벤토리를 적용했습니다.',
    techNote: '팀 기술',
    tech: ['AWS', 'Ansible', 'Docker Swarm', 'Prometheus', 'Grafana'],
  },
];
