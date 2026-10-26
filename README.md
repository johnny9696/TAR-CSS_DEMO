# TAR-CSS 논문 데모 페이지 초안

기존 논문 데모 초안을 옮긴 저장소: [johnny9696/TAR-CSS_DEMO](https://github.com/johnny9696/TAR-CSS_DEMO).

`index.html`을 브라우저에서 열면 됩니다. 설치·빌드 없이 동작하며, GitHub Pages에 올릴 수 있도록 상대 경로만 사용합니다. **현재는 결과표와 페이지 구성이 들어 있는 초안입니다. 제목·저자·초록·대표 그림·음성 샘플은 아직 미입력입니다.**

GitHub Pages를 사용할 때는 저장소 **Settings → Pages → Deploy from a branch → main / (root)** 로 설정합니다. 공개 후 주소는 `https://johnny9696.github.io/TAR-CSS_DEMO/`입니다.

## 구성

논문 제목과 저자·소속 → Abstract → 논문 이미지와 설명 → Results → **Naturalness** → **Dialogue Appropriateness**.

Speech Samples는 두 개의 독립된 섹션입니다. 각 섹션 내부에 DailyTalk와 NCSSD 샘플을 따로 입력합니다.

- Naturalness: 현재 발화 대본과 모델별 단일 음성을 비교합니다. 이전 대화·감정 정보는 표시하지 않습니다.
- Dialogue Appropriateness: 이전 대화와 현재 화자·감정·대본을 먼저 보고, 모델별 현재 발화 음성을 비교합니다. 과거 발화에 원본 음성이 있으면 개별 재생도 가능합니다.

두 섹션의 샘플은 `samples.naturalness`와 `samples.dialogue`로 독립 관리합니다. 모델명에는 재학습 여부 등 부가 설명을 붙이지 않습니다. 평가용 MOS/D-MOS 페이지의 문항 수·저장 방식은 변경하지 않습니다.

Results에는 사용자가 지정한 Tables I–V의 수치를 반영했습니다. DailyTalk mel-level, DailyTalk waveform-level, NCSSD, missing-modality, task/filtering ablation의 5개 표이며, 208개 객관 수치를 소수점 네 자리로 표시합니다. 모델 순서는 논문과 동일하며 최종 모델 이름은 TAR-CSS입니다. `site-content.js`의 `results.tables[].metricKeys`와 `rows` 순서가 대응합니다. 논문 표에 없는 n, CER, V/UV, 상대 duration 등을 다른 실험에서 임의로 채우지 않았고, Duration MAE를 발화 길이의 초 단위 MAE로 바꾸지 않았습니다.

MOS/D-MOS 청취 평가 표는 미입력 상태로 유지합니다. `—`는 미입력입니다. 확정된 청취 결과는 `results.listening.rows[모델명]`에 입력합니다. 로컬 UI 테스트 점수를 논문 결과로 사용하지 마세요. 이번 갱신은 객관 수치 입력이며, 논문 이미지·음성 샘플은 변경하지 않았습니다.

논문 PDF는 공개 저장소에 포함하지 않습니다. 제목·저자·초록·그림·음성의 페이지 입력 자리는 기존 상태로 유지했습니다. 비어 있는 논문 정보나 청취 결과를 임의로 작성하지 않았습니다.

## 내용 입력

`site-content.js`에서 제목, 저자 배열, 소속 배열, Abstract, 이미지 경로와 샘플을 설정합니다. 이미지는 `assets/figures/`, 음성은 `assets/audio/`에 넣습니다. 서버의 절대 경로나 IP 주소는 넣지 않습니다.

제목 아래 GitHub 아이콘이 있는 Code 버튼을 추가했습니다. 현재 저장소 주소는 사용자 제공 대기이며 링크를 비활성화했습니다. `code.url`에 실제 `https://github.com/…` 주소를 넣으면 활성화됩니다. 임의 저장소로 연결하지 않습니다.

대화 샘플 설정 예시(실제 파일을 준비한 다음 `samples.dialogue` 배열에 추가):

```javascript
{
  dataset: "DailyTalk",
  items: [{
    label: "Sample 1",
    text: "원본 메타데이터에서 확인한 현재 발화 대본",
    speaker: "Speaker 2",
    emotion: "원본 메타데이터에서 확인한 감정",
    history: [{ speaker: "Speaker 1", text: "이전 발화 대본", src: "assets/audio/sample-01-history-01.wav" }],
    audio: [
      { model: "Original", src: "assets/audio/sample-01-original.wav" },
      { model: "IR_CSS", src: "assets/audio/sample-01-ircss.wav" }
    ]
  }]
}
```

Naturalness 샘플은 `samples.naturalness`에 같은 dataset/items 구조로 입력하되, label/text/audio만 사용합니다. history의 src는 선택 항목이며 대화 음성이 아직 없으면 텍스트만 표시합니다. 과거 발화는 시간순으로 입력하고 현재 발화의 별도 정답 음성을 대화 history에 넣지 않습니다. 실파일이 없는 예시 경로를 그대로 배포하지 마세요.

실제 논문 이미지 `figure.src`와 대체 텍스트 `figure.alt`, 설명 `figure.caption`을 함께 지정합니다. 미입력 또는 파일 오류 시 빈 이미지 아이콘 대신 자리 표시를 유지합니다.

## 평가 페이지와 분리

이 폴더는 논문·음성 데모 공개용입니다. MOS/D-MOS 평가 서버, 평가자 ID, 점수 DB, CSV, 서버 접속 정보는 포함하지 않습니다. 이 저장소의 업로드는 기존 평가 서비스와 응답 데이터를 변경하지 않습니다.
