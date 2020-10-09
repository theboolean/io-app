import React from "react";
import { View, Text } from "react-native";
import { makeFontStyleObject } from "../core/fonts";
import { Body } from "../../components/core/typography/Body";
type SpannableText = {
  text: string;
  isBold?: boolean;
};

export class SpannableBlock {
  private texts: Array<SpannableText> = [];

  constructor(text: string, isBold: boolean = false) {
    // eslint-disable-next-line functional/immutable-data
    this.texts.push({ text, isBold });
  }

  public append = (text: string, isBold: boolean = false) => {
    // eslint-disable-next-line functional/immutable-data
    this.texts.push({ text, isBold });
    return this;
  };

  public renderSpannableBlock = (
    keyPrefix: string,
    separator: string = " "
  ): React.ReactNode => {
    const boldStyle = makeFontStyleObject("Bold");
    return (
      <Body>
        {this.texts.map((sb, idx) => (
          <Text key={`${keyPrefix}_${idx}`} style={sb.isBold ? boldStyle : {}}>
            {sb.text}
            {separator}
          </Text>
        ))}
      </Body>
    );
  };
}
