import { Box, Flex } from '@mantine/core'
import StandaloneTranscription from './speech-recognition/components/StandaloneTranscription'

function App() {
  return (
    <Box
      w="100%"
      m={0}
      p={{ base: 15, sm: 20 }}
      style={{ boxSizing: 'border-box' }}
    >
      <Flex
        justify="center"
        mt={30}
      >
        <StandaloneTranscription />
      </Flex>
    </Box>
  )
}

export default App
