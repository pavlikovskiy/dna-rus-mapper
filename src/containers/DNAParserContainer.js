import React, {useEffect, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import codes2 from '../codes-2.json';
import codes3 from '../codes-3.json';

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
    backgroundColor: "#F2F2F2",
    padding: 10,
  },
  paper: {
    padding: "0px",
    textAlign: "left",
  },
  textarea: {
    width: "100%",
    height: 600,
  },
}));

let stats = {};
const incrementStat = (s) => stats[s] = stats[s] ? stats[s] + 1 : 1;

// const formattedLargeNumber = (x) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");


const DNAParserContainer = () => {

  const classes = useStyles();
  const [left, setLeft] = useState('');
  const [right, setRight] = useState('');
  const [step, setStep] = React.useState(3);
  const [codes, setCodes] = React.useState(codes3);

  const handleNDA = () => {
    stats = {}; // reset stats
    // remove line numbers if any and spaces and new lines
    let r = left.replace(new RegExp("[0-9 \n]", "g"), "");

    let outStr = '';
    for (let i = 0; i <= r.length - step; i = i + step) {
      const str = r.substring(i, i + step);
      if (codes[str]) {
        outStr += ` ${Array.isArray(codes[str]) ? '<b>[' + codes[str].join(', ') + ']</b>' : '<b>' + codes[str] + '</b>'}`;
        incrementStat(str);
      } else {
        outStr += ` ${str}`;
      }
    }
    setRight(outStr);
  }

  const handleStepChange = (event) => {
    const newStep = parseInt(event.target.value, 10);
    setStep(newStep);
    switch (newStep) {
      case 2:
        setCodes(codes2);
        break;
      case 3:
        setCodes(codes3);
        break;
    }
  };

  const handleLeftChange = (e) => {
    setLeft(e.target.value);
  }

  useEffect(() => {
    handleNDA();
  }, [step, left]);


  // replacement stat
  const statArr = [];
  Object.entries(codes).forEach(([key, value]) => {
    let str = `${key} => ${Array.isArray(value) ? '[' + value.join(',') + ']' : value}`;
    if (stats[key]) {
      str += `, found ${stats[key]}`
    }
    statArr.push(str);
  })

  // estimate permutations
  let totalPermutations = 1;
  Object.entries(codes).forEach(([key, value]) => {
    if (Array.isArray(value) && stats[key]) {
      totalPermutations *= value.length * stats[key];
    }
  })


  return (
    <div className={classes.root}>
      <Grid container spacing={1}>

        <Grid item sm={6}>
          <Typography>Input (e.g. copy from https://www.ncbi.nlm.nih.gov/nuccore/NM_006547.3 and paste
            below)</Typography>
          <div className={classes.paper}>
            <textarea
              name='left'
              value={left}
              onChange={handleLeftChange}
              className={classes.textarea}
            >
            </textarea>
          </div>
        </Grid>

        <Grid item sm={6}>
          <Typography>Output</Typography>
          <div className={classes.paper}>
            <div
              name='right'
              className={classes.textarea}
              disabled
              dangerouslySetInnerHTML={{__html: right}}
            >
            </div>
          </div>
        </Grid>

        <Grid item sm={6}>
          <FormControl style={{width: 100, paddingBottom: 20}}>
            <InputLabel id="select-step-label">Code Step</InputLabel>
            <Select
              labelId="select-step-label"
              id="select-step"
              value={step}
              label="Age"
              onChange={handleStepChange}
            >
              <MenuItem value={3}>3</MenuItem>
              <MenuItem value={2}>2</MenuItem>
            </Select>
          </FormControl>

          <Typography>Codes and stats</Typography>
          <div className={classes.paper}>
            {
              statArr.map(row => (<div>{row}</div>))
            }
          </div>
          {totalPermutations > 1 && (
            <div className={classes.paper} style={{paddingTop: 10}}>
              Total permutations: {totalPermutations}
            </div>
          )}
        </Grid>

        <Grid item sm={6}>
        </Grid>

      </Grid>
    </div>
  );
};

export default DNAParserContainer;
