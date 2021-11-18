import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import codes from '../codes.json';

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

  const handleNDA = (e) => {
    stats = {}; // reset stats
    const l = e.target.value;
    setLeft(l);
    // remove line numbers if any and spaces and new lines
    let r = l.replace(new RegExp("[0-9 \n]", "g"), "");

    let outStr = '';
    for (let i = 0; i < r.length - 2; i = i+3) {
      const str = r.substring(i, i+3);
      if (codes[str]) {
        outStr += ` ${Array.isArray(codes[str]) ? '<b>[' + codes[str].join(', ') + ']</b>' : '<b>' + codes[str] + '</b>'}`;
        incrementStat(str);
      } else {
        outStr += ` ${str}`;
      }
    }
    setRight(outStr);
  }

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
          <Typography>Input (e.g. copy from https://www.ncbi.nlm.nih.gov/nuccore/NM_006547.3 and paste below)</Typography>
          <div className={classes.paper}>
            <textarea
            name='left'
            value={left}
            onChange={handleNDA}
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
          <Typography>Codes and stats</Typography>
          <div className={classes.paper}>
            {
              statArr.map( row => (<div>{row}</div>))
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
