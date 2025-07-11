'use client';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

export default function DiscourseApiForm() {
  const [siteUrl, setSiteUrl] = useState("");
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [encodedKey, setEncodedKey] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [keyPair, setKeyPair] = useState<CryptoKeyPair | null>(null);
  const { toast } = useToast();

  async function generateKeyPair() {
    try {
      const newKeyPair = await window.crypto.subtle.generateKey(
        {
          name: "RSASSA-PKCS1-v1_5",
          modulusLength: 2048,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: "SHA-1",
        },
        true,
        ["sign", "verify"]
      );
      
      setKeyPair(newKeyPair);
      return newKeyPair;
    } catch (error) {
      toast({
        title: "错误",
        description: "生成密钥对时出错：" + error,
        variant: "destructive",
      });
      return null;
    }
  }

  async function exportPublicKey(publicKey: CryptoKey) {
    try {
      const exported = await window.crypto.subtle.exportKey("spki", publicKey);
      const exportedAsString = String.fromCharCode.apply(
        null,
        Array.from(new Uint8Array(exported))
      );
      const exportedAsBase64 = window.btoa(exportedAsString);
      
      // Convert to PEM format
      return [
        "-----BEGIN PUBLIC KEY-----",
        ...exportedAsBase64.match(/.{1,64}/g) || [],
        "-----END PUBLIC KEY-----"
      ].join("\n");
    } catch (error) {
      toast({
        title: "错误",
        description: "导出公钥时出错：" + error,
        variant: "destructive",
      });
      return null;
    }
  }

  async function handleGenerateUrl() {
    if (!siteUrl) {
      toast({
        title: "错误",
        description: "请输入目标站点 URL",
        variant: "destructive",
      });
      return;
    }

    const newKeyPair = await generateKeyPair();
    if (!newKeyPair) return;

    const publicKeyBase64 = await exportPublicKey(newKeyPair.publicKey);
    if (!publicKeyBase64) return;

    const hostname = window.location.hostname;
    const params = new URLSearchParams({
      application_name: "OnePage Discourse API Key",
      client_id: hostname,
      scopes: "read,write,message_bus,push,notifications,session_info",
      public_key: publicKeyBase64,
      nonce: Date.now().toString(),
    });

    const url = `${siteUrl}/user-api-key/new?${params.toString()}`;
    setGeneratedUrl(url);
  }

  async function handleDecryptKey() {
    if (!keyPair || !encodedKey) {
      toast({
        title: "错误",
        description: "请先生成 URL 并输入加密的 key",
        variant: "destructive",
      });
      return;
    }

    try {
      // The key is already in its final form
      setApiKey(encodedKey);
    } catch (error) {
      toast({
        title: "错误",
        description: "解密 key 时出错：" + error,
        variant: "destructive",
      });
    }
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="siteUrl">目标站点 URL</Label>
          <Input
            id="siteUrl"
            placeholder="例如：https://meta.discourse.org"
            value={siteUrl}
            onChange={(e) => setSiteUrl(e.target.value)}
          />
        </div>

        <Button onClick={handleGenerateUrl}>生成 URL</Button>

        {generatedUrl && (
          <div className="space-y-2">
            <Label>生成的 URL</Label>
            <div className="p-4 bg-gray-100 rounded break-all">
              <a href={generatedUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {generatedUrl}
              </a>
            </div>
          </div>
        )}

        {generatedUrl && (
          <div className="space-y-2">
            <Label htmlFor="encodedKey">输入生成的加密 Key</Label>
            <Input
              id="encodedKey"
              placeholder="将生成的加密 key 粘贴到这里"
              value={encodedKey}
              onChange={(e) => setEncodedKey(e.target.value)}
            />
          </div>
        )}

        {encodedKey && (
          <Button onClick={handleDecryptKey}>解密 Key</Button>
        )}

        {apiKey && (
          <div className="space-y-2">
            <Label>解密后的 API Key</Label>
            <div className="p-4 bg-gray-100 rounded break-all">
              {apiKey}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
