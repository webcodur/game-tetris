let audioContext;
let gainNode;
let sourceNodes = []; // 여러 개의 sourceNode를 관리하기 위한 배열

// AudioContext와 GainNode를 초기화하는 함수
const initializeAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    gainNode = audioContext.createGain();
    gainNode.connect(audioContext.destination);
  }
};

const getAudioContext = () => {
  initializeAudioContext();
  return audioContext;
};

/**
 * 파일명에 해당하는 오디오 파일을 재생하는 비동기 함수 (재생 완료 직후 작업이 필요할 시 비동기로 호출)
 * @param {string} fileName 파일명
 * @param {string} [identifier] 식별자 (선택 사항)
 * @param {function} [onEndedCallback] 음원 종료 시 호출될 콜백 함수 (선택 사항)
 */
export async function playSingleAudio(fileName, identifier, onEndedCallback) {
  // 식별자가 없는 경우 식별자를 fileName으로 설정하여 기존 코드 호환성 유지
  if (typeof identifier !== "string") {
    onEndedCallback = identifier;
    identifier = fileName;
  }

  const audioContext = getAudioContext();
  if (audioContext.state === "suspended") {
    await audioContext.resume(); // 재시작
  }

  try {
    const audioPath = `${process.env.PUBLIC_URL}/audio/`;
    const response = await fetch(`${audioPath}${fileName}`);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    const sourceNode = audioContext.createBufferSource(); // 새로운 소스 노드 생성

    gainNode.gain.value = 1; // 볼륨 기본값 설정

    sourceNode.buffer = audioBuffer;
    sourceNode.connect(gainNode);

    sourceNode.start(0);
    sourceNodes.push({ sourceNode, identifier }); // 소스 노드와 식별자를 배열에 추가

    sourceNode.onended = () => {
      sourceNodes = sourceNodes.filter((node) => node.sourceNode !== sourceNode); // 재생 완료 시 배열에서 제거
      if (typeof onEndedCallback === "function") {
        onEndedCallback(); // 콜백 함수 호출
      }
    };
  } catch (error) {
    console.error("오디오 재생 중 오류 발생:", error);
  }
}

// 특정 식별자의 오디오 재생 중단 함수
export function stopAudio(identifier) {
  sourceNodes.forEach((node) => {
    if (node.identifier === identifier) {
      node.sourceNode.stop(); // 특정 식별자의 오디오 중단
    }
  });
  sourceNodes = sourceNodes.filter((node) => node.identifier !== identifier); // 배열에서 제거
}

// 특정 식별자의 오디오 실행 여부 확인 함수
export function isAudioPlaying(identifier) {
  return sourceNodes.some((node) => node.identifier === identifier);
}
