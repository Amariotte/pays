import { PLATEFORME_MESSAGE, TYPE_MESSAGE } from "@/lib/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { mailService } from "./mail.service";
import { User } from "@/lib/generated/prisma/client";
import { smsService } from "./sms.service";

export class MessagerieService {

  async getTemplate(type: TYPE_MESSAGE, plateforme: PLATEFORME_MESSAGE) {

    const template = await prisma.messageTemplate.findFirst({
      where: { type , plateforme },
    });

    if (!template) {
      throw new Error("Template not found");
    }

    return template;
  }

  replaceVariables(content: string, variables: Record<string, string>) {

    let result = content;

    for (const key in variables) {
      const value = variables[key];
      const regex = new RegExp(`{{${key}}}`, "g");
      result = result.replace(regex, value);
    }

    return result;
  }

   async sendMessages(type: TYPE_MESSAGE,User : User) {

    const templates = await prisma.messageTemplate.findMany({
      where: { type },
    });

    if (!templates || templates.length === 0) {
      throw new Error("Template not found");
    }

      for (const template of templates) {

        const content = this.replaceVariables(template.content, {});

        switch (template.plateforme) 
        {
          case PLATEFORME_MESSAGE.EMAIL:
             mailService.send({
              to: User.email,         
              subject: template.subject,
              html: content
            });
            break;                                        
          case PLATEFORME_MESSAGE.SMS:
            smsService.send({
            phone : User.phone,
            content: content
          });
        }

      }
  }

  
}

export const messagerieService = new MessagerieService();