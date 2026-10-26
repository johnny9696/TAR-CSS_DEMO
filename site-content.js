// 논문 정보가 확정되면 이 파일만 수정합니다. 미입력 내용은 초안 자리로 표시됩니다.
// 모든 경로는 index.html 기준 상대 경로입니다. GitHub 저장소 이름을 넣지 않습니다.
window.PG_CSS_PAPER = {
  title: "",
  authors: [],
  affiliations: [],
  code: { url: "" }, // GitHub 저장소 주소는 추후 입력합니다.
  abstract: "",
  figure: { src: "", alt: "", caption: "" },
  results: {
    // 사용자 지정 평가 수치: Tables I–V.
    // MOS / D-MOS는 미확정이므로 입력하지 않습니다. 논문 표에 없는 지표를 다른 결과에서 섞지 않습니다.
    source: { tables: "I–V", updated: "2026-10-12" },
    models: ["DailyTalk", "FC-Talker", "DialogueGCN", "MSRGCN", "ECSS", "I3-CSS", "RADKA-CSS", "TAR-CSS"],
    metrics: [
      { key: "mel_dtw", label: "Mel (DTW) ↓", description: "Target-free 생성 결과와 정답 Mel 스펙트로그램을 DTW로 정렬한 후 비교한 오차." },
      { key: "mel_mae", label: "Mel (MAE) ↓", description: "정답 duration을 제공한 target-duration 조건에서의 Mel 평균 절대 오차." },
      { key: "energy_dtw", label: "Energy (DTW) ↓", description: "Target-free 생성 결과의 에너지를 DTW 기반으로 비교한 오차." },
      { key: "energy_mae", label: "Energy (MAE) ↓", description: "Target-duration 조건에서의 에너지 평균 절대 오차." },
      { key: "pitch_dtw", label: "Pitch (DTW) ↓", description: "Target-free 생성 결과의 음높이를 DTW 기반으로 비교한 오차." },
      { key: "pitch_mae", label: "Pitch (MAE) ↓", description: "Target-duration 조건에서의 음높이 평균 절대 오차." },
      { key: "duration_mae", label: "Duration (MAE) ↓", description: "논문에 보고된 duration 평균 절대 오차. 발화 전체 길이의 초 단위 MAE로 재표기하지 않았습니다." },
      { key: "mcd", label: "MCD ↓", description: "동일한 HiFi-GAN으로 복원한 생성 파형과 원본 파형 사이의 Mel-cepstral distortion." },
      { key: "wer", label: "WER ↓", description: "Whisper로 측정한 단어 오류율. 논문의 비율 표기를 유지합니다(예: 0.0900 = 9.00%)." },
      { key: "emotion_cosine", label: "Emo-Sim ↑", description: "동일한 사전학습 감정 인코더로 추출한 생성·원본 음성 표현의 cosine similarity. 논문 표 수치를 그대로 사용합니다." },
    ],
    tables: [
      {
        id: "paper-table-i", title: "Table I · DailyTalk — Mel-level objective evaluation",
        note: "DTW: target-free inference. Mel / Energy / Pitch MAE: target-duration inference. Duration MAE는 별도 지표입니다.",
        metricKeys: ["mel_dtw", "mel_mae", "energy_dtw", "energy_mae", "pitch_dtw", "pitch_mae", "duration_mae"],
        rows: [
          ["DailyTalk", [0.8112, 0.9017, 0.3866, 0.4301, 0.3314, 0.3264, 0.2535]],
          ["FC-Talker", [0.8026, 0.8971, 0.3903, 0.4376, 0.3555, 0.3503, 0.2575]],
          ["DialogueGCN", [0.8188, 0.8996, 0.4062, 0.4461, 0.3447, 0.3419, 0.2621]],
          ["MSRGCN", [0.8322, 0.9166, 0.4047, 0.4413, 0.3424, 0.3446, 0.2631]],
          ["ECSS", [0.8202, 0.9096, 0.3905, 0.4388, 0.3527, 0.3510, 0.2550]],
          ["I3-CSS", [0.8107, 0.8915, 0.3878, 0.4302, 0.3500, 0.3458, 0.2508]],
          ["RADKA-CSS", [0.8390, 0.9146, 0.4167, 0.4535, 0.3562, 0.3483, 0.2512]],
          ["TAR-CSS", [0.7429, 0.8281, 0.3796, 0.4220, 0.3182, 0.3165, 0.2528]],
        ],
      },
      {
        id: "paper-table-ii", title: "Table II · DailyTalk — Waveform-level objective evaluation",
        note: "모든 모델에 동일한 HiFi-GAN vocoder를 사용한 파형 평가입니다. MOS / D-MOS는 아래 청취 평가표에 별도로 두었습니다.",
        metricKeys: ["mcd", "wer", "emotion_cosine"],
        rows: [
          ["DailyTalk", [9.2942, 0.0900, 0.8167]],
          ["FC-Talker", [9.2593, 0.0950, 0.8160]],
          ["DialogueGCN", [9.3608, 0.0930, 0.8111]],
          ["MSRGCN", [9.3905, 0.0948, 0.8255]],
          ["ECSS", [9.3526, 0.1015, 0.8005]],
          ["I3-CSS", [9.3503, 0.0968, 0.8117]],
          ["RADKA-CSS", [9.3317, 0.0906, 0.8182]],
          ["TAR-CSS", [9.0415, 0.0940, 0.8125]],
        ],
      },
      {
        id: "paper-table-iii", title: "Table III · NCSSD — Cross-dataset generalization",
        note: "DailyTalk에서 학습한 모델을 추가 학습이나 adaptation 없이 NCSSD에서 평가한 결과입니다.",
        metricKeys: ["mel_dtw", "energy_dtw", "pitch_dtw", "duration_mae", "mcd", "wer", "emotion_cosine"],
        rows: [
          ["DailyTalk", [1.9414, 0.2615, 0.3355, 0.2580, 26.0372, 0.1385, 0.7961]],
          ["FC-Talker", [1.9396, 0.2585, 0.3378, 0.2493, 25.9422, 0.1581, 0.7975]],
          ["DialogueGCN", [1.9258, 0.2626, 0.4041, 0.2357, 26.0433, 0.1245, 0.7905]],
          ["MSRGCN", [1.9179, 0.2281, 0.3961, 0.2285, 25.8411, 0.1908, 0.7920]],
          ["ECSS", [1.9166, 0.2398, 0.3343, 0.2654, 25.9426, 0.1548, 0.7954]],
          ["I3-CSS", [1.9276, 0.2520, 0.3311, 0.2614, 26.1763, 0.1355, 0.7983]],
          ["RADKA-CSS", [1.9549, 0.2410, 0.3699, 0.2509, 25.8037, 0.1214, 0.7909]],
          ["TAR-CSS", [1.9011, 0.2295, 0.2926, 0.2131, 26.4112, 0.1289, 0.7989]],
        ],
      },
      {
        id: "paper-table-iv", title: "Table IV · Missing-modality ablation",
        rowHeading: "Available modalities",
        note: "Text는 항상 사용하며, Audio / Vision은 해당 조건에서 전체 대화 이력에서 제외합니다.",
        metricKeys: ["mel_dtw", "mel_mae", "energy_dtw", "energy_mae", "pitch_dtw", "pitch_mae", "duration_mae", "emotion_cosine"],
        rows: [
          ["Text + Audio + Vision", [0.7429, 0.8281, 0.3796, 0.4220, 0.3182, 0.3165, 0.2528, 0.8125]],
          ["Text + Audio", [0.7421, 0.8279, 0.3798, 0.4223, 0.3181, 0.3168, 0.2527, 0.8081]],
          ["Text + Vision", [0.7464, 0.8324, 0.3864, 0.4303, 0.3215, 0.3195, 0.2498, 0.8094]],
          ["Text", [0.7470, 0.8329, 0.3880, 0.4316, 0.3215, 0.3192, 0.2503, 0.8075]],
        ],
      },
      {
        id: "paper-table-v", title: "Table V · Task loss and filtering ablation",
        note: "논문의 task loss / filtering / Top-K / low-score selection 비교 결과입니다.",
        metricKeys: ["mel_dtw", "mel_mae", "energy_dtw", "energy_mae", "pitch_dtw", "pitch_mae", "duration_mae", "emotion_cosine"],
        rows: [
          ["TAR-CSS", [0.7429, 0.8281, 0.3796, 0.4220, 0.3182, 0.3165, 0.2528, 0.8125]],
          ["w/o Task Loss", [0.8043, 0.8809, 0.3749, 0.4361, 0.3365, 0.3351, 0.2597, 0.8146]],
          ["w/o Filtering", [0.8148, 0.8978, 0.3892, 0.4318, 0.3398, 0.3170, 0.2608, 0.8111]],
          ["Top-K Selection (K = 5)", [0.8207, 0.9067, 0.4067, 0.4518, 0.3518, 0.3795, 0.2495, 0.8188]],
          ["Low Score", [0.7466, 0.8328, 0.3853, 0.4276, 0.3157, 0.3151, 0.2514, 0.8101]],
        ],
      },
    ],
    listening: { rows: {} },
  },
  samples: {
    // 단일 발화: 현재 대본과 모델별 음성으로 자연스러움을 비교합니다.
    naturalness: [
      { dataset: "DailyTalk", items: [] },
      { dataset: "NCSSD", items: [] },
    ],
    // 대화 적절성: 앞선 대화, 현재 화자·감정·대본과 모델별 음성을 비교합니다.
    dialogue: [
      { dataset: "DailyTalk", items: [] },
      { dataset: "NCSSD", items: [] },
    ],
  },
};
