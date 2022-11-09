import { Group, Container, Divider, Select, Title, Text, Radio, Button, NumberInput, Box, Grid, Switch} from '@mantine/core';
import { useState } from 'react';
import axios from "axios";
import { Stats } from '../Components/Stats';
import { ListItem } from '@mantine/core/lib/List/ListItem/ListItem';

export default function Home() {

  const [Projects, setProjects] = useState([]);
  const [chosen, setChosen] = useState(false);
  const [many, setMany] = useState(false);
  const [running, setRunning] = useState(false);
  const [checked, setChecked] = useState(false);

  const [func, setFunc] = useState<string | null>('eu');
  const [systems, setSystems] = useState(2);
  const [population, setPopulation] = useState(100);
  const [minPos, setMinPos] = useState(-100);
  const [maxPos, setMaxPos] = useState(100);
  const [generations, setGenerations] = useState(500);

  const [results, setResults] = useState([]);

  function sendReq(){
    setRunning(true);
    const url = 'http://localhost:8000/run';

    let val = func

    const temp = {
      systems: (many)? systems: 1,
      generations: generations,
      population: population,
      minPos: minPos,
      maxPos: maxPos,
      func: val
    }

    fetch(url, {method:'POST', mode:'cors', headers: {
      "Content-type": "application/json"
    }, body:JSON.stringify(temp)})
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      setResults(Object.values(data));
      setRunning(false);
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
          variant="filled"
          value={func} 
          onChange={setFunc}
          data={[
            { value: 'eu', label: 'Euclidean' },
            { value: 'egg', label: 'Egg Holder' },
            { value: 'sch', label: 'Schaffer' },
            { value: 'ea', label: 'Easom' },
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
          onClick={() => {setChosen(true)}}
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
          step={1}
          min={2}
          max={10}
          size={"xs"}
          variant="filled"
          value={systems} 
          onChange={(val:number) => setSystems(val)}
        />

      </Group>
      }

      <Group position="center" style={{marginTop:"40px"}}>

      <Switch checked={checked} onChange={() => setChecked(!checked)} label="Configure Parameters" labelPosition="left"/>;

      </Group>

      {checked && (<div>
      <Group position="center" style={{marginTop:"20px"}}>

        <Text weight={500} style={{fontFamily:'sans-serif', marginLeft:"50px", marginRight:"30px"}}>
            Population:
        </Text>

        <NumberInput
          mt="sm"
          radius={"md"}
          aria-label="systems"
          step={50}
          min={1}
          max={100000}
          size={"xs"}
          variant="filled"
          value={population} 
          onChange={(val:number) => setPopulation(val)}
        />

        <Text weight={500} style={{fontFamily:'sans-serif', marginLeft:"20px", marginRight:"30px"}}>
            Max Generations:
        </Text>

        <NumberInput
          mt="sm"
          radius={"md"}
          aria-label="systems"
          step={50}
          min={1}
          max={10000}
          size={"xs"}
          variant="filled"
          value={generations} 
          onChange={(val:number) => setGenerations(val)}
        />

      </Group>

      <Group position="center" style={{marginTop:"20px"}}>

        <Text weight={500} style={{fontFamily:'sans-serif', marginLeft:"20px", marginRight:"30px"}}>
            Min Position: 
        </Text>

        <NumberInput
          mt="sm"
          radius={"md"}
          aria-label="systems"
          step={50}
          size={"xs"}
          variant="filled"
          value={minPos} 
          onChange={(val:number) => setMinPos(val)}
        />

        <Text weight={500} style={{fontFamily:'sans-serif', marginLeft:"30px", marginRight:"30px"}}>
          Max Position: 
        </Text>

        <NumberInput
          mt="sm"
          radius={"md"}
          aria-label="systems"
          step={50}
          size={"xs"}
          variant="filled"
          value={maxPos} 
          onChange={(val:number) => setMaxPos(val)}
        />

      </Group>
      </div>)}

      <Group position="center" style={{marginTop:"40px"}}>

        <Button onClick={sendReq} disabled={!chosen} loading={running}>
          Run
        </Button>

      </Group>

      <Divider my="sm" style={{marginTop:"40px"}}/>

      {results.length != 0 &&  (
      <div>

        <Group style={{marginTop:"20px"}}>

          {results.length == 1 && (
            <Title order={3} style={{fontFamily:"sans-serif", fontWeight:300, marginBottom:"20px", marginTop:"20px"}}>
              Results:
            </Title>
          )}

          {results.length > 1 && (
            <Title order={3} style={{fontFamily:"sans-serif", fontWeight:300, marginBottom:"20px", marginTop:"20px"}}>
              Results Per System:
            </Title>
          )}

        </Group>

        <Grid gutter="xl" >
          {results.map((item) => (
          <Grid.Col span={6} >
            <Box
              sx={(theme) => ({
                backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[1],
                textAlign: 'left',
                padding: theme.spacing.xl,
                borderRadius: theme.radius.md,
                cursor: 'pointer',
                minHeight: 150,
                fontFamily: "sans-serif",
                fontWeight: 200,
                fontSize: "20px",

                '&:hover': {
                  backgroundColor:
                    theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[3],
                },
              })}
            >
              <Text style={{whiteSpace:"pre-line"}}>
                {item}
              </Text>
            </Box>

          </Grid.Col>))}
        </Grid>
      </div>)}

    </Container>
    
  )
}
