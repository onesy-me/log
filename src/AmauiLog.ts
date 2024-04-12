import is from '@amaui/utils/is';
import isEnvironment from '@amaui/utils/isEnvironment';
import merge from '@amaui/utils/merge';
import copy from '@amaui/utils/copy';
import stringify from '@amaui/utils/stringify';
import AmauiDate from '@amaui/date/AmauiDate';
import format from '@amaui/date/format';
import AmauiSubscription from '@amaui/subscription';
import { TMethod } from '@amaui/models';

export type TVariant = 'log' | 'debug' | 'info' | 'warn' | 'error' | 'important';

export const variantNames: Array<TVariant> = ['log', 'debug', 'info', 'warn', 'error', 'important'];

export interface IAmauiLogVariantColor {
  browser: string;
  server: string;
}

export interface IAmauiLogVariantPre {
  subscription: AmauiSubscription;
}

export interface IAmauiLogVariantPost {
  subscription: AmauiSubscription;
}

export interface IAmauiLogVariant {
  name: 'log' | TVariant;
  prefix?: any;
  sufix?: any;
  color?: IAmauiLogVariantColor;
  pre?: IAmauiLogVariantPre;
  post?: IAmauiLogVariantPost;
}

export type IAmauiLogVariants = {
  [p in TVariant]?: IAmauiLogVariant;
};

export interface IAmauiLogOptionsLogPadding {
  top?: boolean;
  bottom?: boolean;
}

export interface IAmauiLogOptionsLog {
  archive?: boolean;
  enabled?: boolean;
  native?: boolean;
  variants?: Array<TVariant>;
  padding?: IAmauiLogOptionsLogPadding;
}

export interface IAmauiLogOptionsArguments {
  pre?: any[];
  post?: any[];
}

export interface IAmauiLogOptionsDate {
  add?: boolean;
  method?: TMethod;
}

export interface IAmauiLogOptionsStringify {
  method?: TMethod;
}

export interface IAmauiLogOptions {
  minimal?: boolean;
  log?: IAmauiLogOptionsLog;
  arguments?: IAmauiLogOptionsArguments;
  variants?: IAmauiLogVariants;
  date?: IAmauiLogOptionsDate;
  stringify?: IAmauiLogOptionsStringify;
}

const optionsDefault: IAmauiLogOptions = {
  minimal: true,
  log: {
    enabled: true,
    native: false,
    variants: variantNames,
    padding: {
      top: true,
      bottom: true
    }
  },
  arguments: {
    pre: [],
    post: []
  },
  variants: {},
  date: {
    add: true,
    method: () => format(AmauiDate.utc, `MM-DD-YYYY HH:mm:ss.SSS`)
  },
  stringify: {
    method: stringify
  }
};

interface ILog {
  method?: TMethod;
  arguments?: string[];
  logged: boolean;
}

export interface IAmauiLog {
  variants: IAmauiLogVariants;
  options: IAmauiLogOptions;
  // Extendable to add new properties, methods
  [property: string]: any;
}

const amalogOptionsDefault: IAmauiLogOptions = {
  log: {
    enabled: true,
    native: false,
    padding: {
      top: true,
      bottom: true
    }
  }
};

class AmauiLog implements IAmauiLog {
  public variants: IAmauiLogVariants = {};
  public archive = [];

  // Able to control some behavior globally
  public static options: IAmauiLogOptions = copy(amalogOptionsDefault);

  public static variants: IAmauiLogVariants = {};

  public static archive = [];

  public static archiveClear(): void {
    this.debug('AmauiLog archive cleared');

    this.archive = [];
  }

  public static get amauilog(): AmauiLog { return new AmauiLog(); }

  public static log(variant_: TVariant = 'debug', ...args: any[]) { return new AmauiLog().log(variant_, ...args); }

  public static debug(...args: any[]) { return new AmauiLog().debug(...args); }

  public static info(...args: any[]) { return new AmauiLog().info(...args); }

  public static warn(...args: any[]) { return new AmauiLog().warn(...args); }

  public static error(...args: any[]) { return new AmauiLog().error(...args); }

  public static important(...args: any[]) { return new AmauiLog().important(...args); }

  public static color(value: any, color: string = 'green', options?: IAmauiLogVariantColor): Array<string> {
    let colorValues: IAmauiLogVariantColor;

    switch (color) {
      case 'blue':
        colorValues = { browser: '#0b9fc3', server: '36' };
        break;

      case 'green':
        colorValues = { browser: '#1fc926', server: '32' };
        break;

      case 'orange':
        colorValues = { browser: '#a9b030', server: '33' };
        break;

      case 'red':
        colorValues = { browser: '#d74644', server: '31' };
        break;

      case 'magenta':
        colorValues = { browser: '#ca00c5', server: '35' };
        break;

      default:
        colorValues = { browser: '#1fc926', server: '32' };
        break;
    }

    if (options) colorValues = options;

    return isEnvironment('browser') ? [`%c${value}`, `color: ${colorValues.browser}`] : [`\x1b${colorValues.server}m${value}\x1b[0m`];
  }

  public static get variantNames(): Array<TVariant> {
    return variantNames;
  }

  public static get variantsDefault(): Array<IAmauiLogVariant> {
    return [
      { name: 'log', prefix: '(', sufix: ')', color: { browser: '#0b9fc3', server: '36' } },
      { name: 'debug', prefix: '(', sufix: ')', color: { browser: '#0b9fc3', server: '36' } },
      { name: 'info', prefix: '(', sufix: ')', color: { browser: '#1fc926', server: '32' } },
      { name: 'warn', prefix: '(', sufix: ')', color: { browser: '#a9b030', server: '33' } },
      { name: 'error', prefix: '(', sufix: ')', color: { browser: '#d74644', server: '31' } },
      { name: 'important', prefix: '(', sufix: ')', color: { browser: '#ca00c5', server: '35' } },
    ];
  }

  public constructor(public options: IAmauiLogOptions = optionsDefault) {
    this.options = merge(options, optionsDefault);

    // Set all variants
    Object.keys(this.options.variants).forEach(key => {
      const variant = this.options.variants[key];

      this.variants[variant.name] = {
        ...variant,
        pre: { subscription: new AmauiSubscription() },
        post: { subscription: new AmauiSubscription() },
      };
    });
  }

  public log(variant_: TVariant = 'debug', ...args: any[]): ILog {
    const variantLog = AmauiLog.variants.log || this.variants.log;
    const variant = this.variants[variant_] || AmauiLog.variants[variant_] || variantLog;

    const logVariants = AmauiLog.options.log?.variants || this.options.log.variants;

    if (
      variant &&
      logVariants.indexOf(variant_) > -1
    ) {
      // Pre methods run
      if (variantLog !== variant) (variantLog.pre.subscription.emit as any)(...args);

      (variant.pre.subscription.emit as any)(...args);

      const dateMethod = is('function', this.options.date.method) && this.options.date.method;

      const date = this.options.date.add && dateMethod && dateMethod();

      const arguments_ = [];

      // Log
      const logNative = AmauiLog.options.log.native && this.options.log.native;

      const method = (logNative && console[variant_]) || console.log;

      const space = this.options.minimal ? ' ' : '\n';

      const firstArgument = [];

      // Log padding top
      let logPaddingTop = '';

      if (AmauiLog.options.log?.padding?.top && this.options.log?.padding?.top) {
        logPaddingTop = (AmauiLog.options.log?.padding?.top && this.options.log?.padding?.top) ? space : '';

        if (isEnvironment('browser') && (logNative && ['error', 'warn'].indexOf(variant_) > -1)) logPaddingTop = '';
      }

      if (date) {
        firstArgument.push(`${logPaddingTop}${date} `);
      }

      if (!this.options.minimal && !date && logPaddingTop) {
        firstArgument.push(logPaddingTop);
      }

      firstArgument[0] += isEnvironment('browser') ? `%c${variant.prefix}${variant.name}${variant.sufix}:` : `\x1b[${variant.color.server}m${variant.prefix}${variant.name}${variant.sufix}\x1b[0m:`;

      if (isEnvironment('browser')) firstArgument.push(`color: ${variant.color.browser}`);

      const args_ = [
        ...(this.options.arguments.pre || []),
        ...args,
        ...(this.options.arguments.post || []),
      ];

      if (args_.length === 1 && is('simple', args_[0])) arguments_.push(args_[0]);
      else {
        arguments_.push(args_.map((argument, index) => {
          const isSimple = is('simple', argument);

          // Nice enter space/s above logged line
          let item = index === 0 ? this.options.minimal ? space : `${space}${space}` : '';

          const previous = index - 1 >= 0 && args[index - 1];

          if (index !== 0 && previous && is('simple', previous) && !isSimple) item += space;

          const stringifyMethod = is('function', this.options.stringify.method) && this.options.stringify.method;

          if (argument instanceof Error) item += `${argument.message}${space}${space}${argument.stack}`;
          else item += isSimple ? argument : (stringifyMethod ? stringifyMethod(argument) : argument);

          // Nice enter space below logged line
          if (index !== args_.length - 1) {
            item += space;

            if (!isSimple) item += space;
          }

          return item;
        }));
      }

      // Log padding bottom
      let logPaddingBottom = '';

      if (AmauiLog.options.log?.padding?.bottom && this.options.log?.padding?.bottom) {
        if (isEnvironment('nodejs')) logPaddingBottom = space;

        if (isEnvironment('browser')) {
          logPaddingBottom = `${space}${space}`;

          if ((logNative && ['error', 'warn'].indexOf(variant_) > -1) && args_.length <= 1) logPaddingBottom = '';
        }
      }

      if (!this.options.minimal && logPaddingBottom) arguments_.push(logPaddingBottom);

      const allArguments = [...firstArgument, ([].concat(...arguments_)).join('')].map((item, index) => {
        if (!index) {
          if (this.options.minimal) return item.trimStart();
        }

        return item;
      });

      // More for testing purposes
      const output = {
        method,
        arguments: allArguments,
        logged: false,
      };

      if (AmauiLog.options.log.enabled && this.options.log.enabled) {
        method(...allArguments);

        output.logged = true;
      }

      // Post methods run
      if (variantLog !== variant) (variantLog.post.subscription.emit as any)(...args);

      (variant.post.subscription.emit as any)(...args);

      // Archive
      if (AmauiLog.options.log.archive) AmauiLog.archive.push(output);

      if (this.options.log.archive) this.archive.push(output);

      return output;
    }

    // More for testing purposes
    return {
      logged: false,
    };
  }

  public debug(...args: any[]): undefined | ILog {
    return this.log('debug', ...args);
  }

  public info(...args: any[]): undefined | ILog {
    return this.log('info', ...args);
  }

  public warn(...args: any[]): undefined | ILog {
    return this.log('warn', ...args);
  }

  public error(...args: any[]): undefined | ILog {
    return this.log('error', ...args);
  }

  public important(...args: any[]): undefined | ILog {
    return this.log('important', ...args);
  }

  public archiveClear(): void {
    this.debug('Archive cleared');

    this.archive = [];
  }

  public static reset(): void {
    AmauiLog.options = copy(amalogOptionsDefault);

    // Add AmauiLog global variants
    AmauiLog.variantsDefault.forEach(variant => AmauiLog.variants[variant.name] = {
      ...variant,
      pre: { subscription: new AmauiSubscription() },
      post: { subscription: new AmauiSubscription() },
    });
  }
}

// Add AmauiLog global variants
AmauiLog.variantsDefault.forEach(variant => AmauiLog.variants[variant.name] = {
  ...variant,
  pre: { subscription: new AmauiSubscription() },
  post: { subscription: new AmauiSubscription() },
});

export default AmauiLog;
