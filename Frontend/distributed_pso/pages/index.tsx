import { Group, Container, Divider, Select, Title, Text, Radio, Button, NumberInput} from '@mantine/core';
import { useState } from 'react';
import axios from "axios";

export default function Home() {

  const [Projects, setProjects] = useState([]);
  const [chosen1, setChosen1] = useState(false);
  const [chosen2, setChosen2] = useState(false);
  const [many, setMany] = useState(false);

  function sendReq(){
    const url = 'http://localhost:8000/single'
    fetch(url, {method:'GET', mode:'cors'})
    .then(function(response) {
      return response.json();
    }).then(function(data) {
      console.log(data);  
    });
  }

  return (
    <Container size="lg" style={{marginTop:"20px"}}>

      <Group position="center">
        <Title order={2} style={{fontFamily:"sans-serif", fontWeight:300}}>
          PSO Execution Environment
        </Title>
      </Group>

      <Divider my="sm" />

      <Group position="center" style={{marginTop:"40px"}}>

        <Text weight={500} style={{fontFamily:'sans-serif', marginRight:"20px"}}>
            Choose Function
        </Text>

        <Select
          aria-label="function"
          placeholder="Pick one"
          style={{fontFamily:'sans-serif'}}
          onClick={() => {setChosen1(true)}}
          variant="filled"
          data={[
            { value: 'euclidean', label: 'Euclidean' },
            { value: 'quad', label: 'Quadratic' },
            { value: 'banana', label: 'Banana' },
            { value: 'brr', label: 'Apple' },
          ]}
        />

      </Group>

      <Group position="center">

        <Text weight={500} style={{fontFamily:'sans-serif'}}>
            Environment
        </Text>

        <Radio.Group
          name="env"
          aria-label="env"
          orientation="vertical"
          withAsterisk
          onClick={() => {setChosen2(true)}}
          style={{fontFamily:'sans-serif', marginTop:"40px", marginLeft:"40px"}}
        >
          <Radio value="single" label="Single System" onClick={()=>{setMany(false)}} />
          <Radio value="many" label="Distributed Systems" onClick={()=>{setMany(true)}}/>
        </Radio.Group>

      </Group>

      {many &&
        <Group position="center" style={{fontFamily:'sans-serif', transition:"ease-in", marginLeft:"400px"}}>

        <Text weight={500} style={{fontFamily:'sans-serif', marginRight:"20px", fontWeight:200, color:"grey"}}>
            Enter number of systems
        </Text>

        <NumberInput
          mt="sm"
          radius={"md"}
          aria-label="systems"
          defaultValue={2}
          step={1}
          min={0}
          max={10}
          size={"xs"}
          variant="filled"
        />

      </Group>
      }

      <Group position="center" style={{marginTop:"40px"}}>

        <Button onClick={sendReq} disabled={!chosen1 || !chosen2} >
          Run
        </Button>

      </Group>

    </Container>
    
  )
}
